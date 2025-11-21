import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Upload, CreditCard, CheckCircle2 } from 'lucide-react';
import KushkiPaymentForm from '@/components/KushkiPaymentForm';
import { toast } from '@/lib/toast';
import { apiService, PlanSuscripcionDTO } from '@/services/api';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { 
    price = 72, 
    period = 'anual', 
    planName = 'Professional',
    monthlyPrice = 80,
    annualPrice = 864
  } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState<'kushki' | 'comprobante'>('kushki');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(null);
  const [planId, setPlanId] = useState<number | null>(null);

  const planPrice = price;
  const totalAmount = period === 'anual' ? annualPrice : planPrice;

  // Obtener el ID del plan desde el nombre
  useEffect(() => {
    const fetchPlanId = async () => {
      try {
        const response = await apiService.getAllPlanesSuscripcion();
        if (response.isSuccess && response.data) {
          const plan = response.data.find(p => 
            p.nombre.toLowerCase() === planName.toLowerCase()
          );
          if (plan) {
            setPlanId(plan.idPlan);
          }
        }
      } catch (error) {
        console.error('Error al obtener planes:', error);
      }
    };
    fetchPlanId();
  }, [planName]);

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !user) {
      // Intentar recuperar información del plan desde sessionStorage
      const pendingPayment = sessionStorage.getItem('pendingPayment');
      if (pendingPayment) {
        const paymentData = JSON.parse(pendingPayment);
        navigate('/login', { 
          state: { 
            redirectTo: '/payment',
            paymentData 
          } 
        });
      } else {
        navigate('/login', { state: { redirectTo: '/payment' } });
      }
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobanteFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprobantePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKushkiToken = async (token: string) => {
    if (!user?.idCooperativa || !planId) {
      toast.error('Error', 'No se pudo obtener la información necesaria para procesar el pago.');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Procesando pago...');
    try {
      const response = await apiService.processPayment({
        idCooperativa: user.idCooperativa,
        idPlan: planId,
        periodo: period === 'anual' ? 'Anual' : 'Mensual',
        montoPagado: totalAmount,
        metodoPago: 'Kushki',
        tokenKushki: token,
      });

      if (response.isSuccess) {
        toast.dismiss(loadingToast);
        toast.success('Pago procesado', 'Tu pago ha sido procesado correctamente. Redirigiendo...');
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.dismiss(loadingToast);
        toast.error('Error al procesar', response.message || 'No se pudo procesar el pago. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error al procesar', 'No se pudo procesar el pago. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  const handleKushkiError = (error: string) => {
    setLoading(false);
    toast.error('Error en el pago', error);
  };

  const handleComprobanteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comprobanteFile || !user?.idCooperativa || !planId) {
      toast.error('Error', 'Por favor, completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Enviando comprobante...');
    
    try {
      // Convertir archivo a base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1]; // Remover el prefijo data:image/...;base64,
        
        try {
          const response = await apiService.processPayment({
            idCooperativa: user.idCooperativa,
            idPlan: planId,
            periodo: period === 'anual' ? 'Anual' : 'Mensual',
            montoPagado: totalAmount,
            metodoPago: 'Comprobante',
            comprobantePago: base64String,
            nombreComprobante: comprobanteFile.name,
          });

          if (response.isSuccess) {
            toast.dismiss(loadingToast);
            toast.success('Comprobante enviado', 'Tu comprobante ha sido recibido. Te contactaremos pronto para confirmar tu suscripción.');
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            toast.dismiss(loadingToast);
            toast.error('Error al enviar', response.message || 'No se pudo enviar el comprobante. Por favor, intenta nuevamente.');
            setLoading(false);
          }
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error('Error al enviar', 'No se pudo enviar el comprobante. Por favor, intenta nuevamente.');
          setLoading(false);
        }
      };
      reader.readAsDataURL(comprobanteFile);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error al enviar', 'No se pudo enviar el comprobante. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#1A2332] mb-2">¡Pago Procesado!</h2>
              <p className="text-gray-600 mb-6">
                Tu solicitud de pago ha sido enviada correctamente. Te contactaremos pronto para confirmar tu suscripción.
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1A2332] mb-2">Proceso de Pago</h1>
          <p className="text-xl text-gray-600">Plan {planName}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resumen del Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Plan</CardTitle>
              <CardDescription>Detalles de tu suscripción</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Plan seleccionado</p>
                <p className="text-xl font-bold text-[#1A2332]">{planName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Precio {period === 'anual' ? 'mensual (pago anual)' : 'mensual'}</p>
                <p className="text-3xl font-bold text-[#0066FF]">${planPrice}<span className="text-lg text-gray-600">/mes</span></p>
                {period === 'anual' && (
                  <>
                    <p className="text-sm text-gray-500 mt-1">Facturación anual</p>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-500 line-through">${monthlyPrice * 12}</p>
                      <p className="text-xl font-bold text-[#0066FF]">${annualPrice.toFixed(0)}/año</p>
                      <p className="text-xs text-green-600 mt-1">Ahorras ${(monthlyPrice * 12 - annualPrice).toFixed(0)}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="pt-4 border-t">
                {period === 'anual' && (
                  <>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Precio mensual × 12</span>
                      <span className="font-semibold">${monthlyPrice * 12}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Descuento (10%)</span>
                      <span className="font-semibold text-green-600">-${(monthlyPrice * 12 - annualPrice).toFixed(0)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total a pagar</span>
                  <span className="text-[#0066FF]">${totalAmount.toFixed(0)}</span>
                </div>
                {period === 'anual' && (
                  <p className="text-xs text-gray-500 mt-1">Pago único anual</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Métodos de Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
              <CardDescription>Elige cómo deseas pagar</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'kushki' | 'comprobante')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="kushki">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Kushki
                  </TabsTrigger>
                  <TabsTrigger value="comprobante">
                    <Upload className="w-4 h-4 mr-2" />
                    Comprobante
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="kushki" className="mt-6">
                  <KushkiPaymentForm
                    amount={totalAmount}
                    onSuccess={handleKushkiToken}
                    onError={handleKushkiError}
                    loading={loading}
                  />
                </TabsContent>

                <TabsContent value="comprobante" className="mt-6">
                  <form onSubmit={handleComprobanteSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="comprobante">Comprobante de Pago</Label>
                      <Input
                        id="comprobante"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="mt-2"
                        required
                      />
                      {comprobantePreview && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                          {comprobanteFile?.type.startsWith('image/') ? (
                            <img
                              src={comprobantePreview}
                              alt="Comprobante"
                              className="max-w-full h-48 object-contain border rounded"
                            />
                          ) : (
                            <div className="p-4 border rounded bg-gray-50">
                              <p className="text-sm text-gray-600">{comprobanteFile?.name}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Alert>
                      <AlertDescription>
                        Por favor, sube una foto o PDF de tu comprobante de pago. Nos pondremos en contacto contigo para confirmar tu suscripción.
                      </AlertDescription>
                    </Alert>
                    <Button
                      type="submit"
                      disabled={loading || !comprobanteFile}
                      className="w-full bg-[#0066FF] hover:bg-[#0052CC]"
                    >
                      {loading ? 'Enviando...' : 'Enviar Comprobante'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

