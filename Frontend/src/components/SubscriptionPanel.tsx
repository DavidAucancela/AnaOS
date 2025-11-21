import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, SuscripcionDTO, PlanSuscripcionDTO } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, XCircle, CreditCard, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from '@/lib/toast';

interface SubscriptionPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Componente de Pricing reutilizable para el panel
const PricingPlans: React.FC<{ 
  onPlanSelect: (planName: string, planPrice: number | null, plan: PlanSuscripcionDTO, isAnnual: boolean) => void;
  planes: PlanSuscripcionDTO[];
}> = ({ onPlanSelect, planes }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const getPlanFeatures = (plan: PlanSuscripcionDTO): string[] => {
    const features: string[] = [];
    if (plan.descripcion) {
      features.push(plan.descripcion);
    }
    if (plan.maxUsuarios) {
      features.push(`Hasta ${plan.maxUsuarios} usuarios`);
    }
    if (plan.maxAgencias) {
      features.push(`Hasta ${plan.maxAgencias} agencias`);
    }
    if (plan.maxCuentas) {
      features.push(`Hasta ${plan.maxCuentas} cuentas`);
    }
    if (plan.almacenamientoGb) {
      features.push(`${plan.almacenamientoGb} GB de almacenamiento`);
    }
    if (plan.soportePrioritario) {
      features.push('Soporte prioritario');
    }
    if (plan.apiAccess) {
      features.push('Acceso a API');
    }
    if (plan.customizacionBranding) {
      features.push('Personalización de marca');
    }
    return features.length > 0 ? features : ['Consultas ilimitadas', 'Soporte por email'];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <span className={!isAnnual ? 'font-bold text-gray-900' : 'text-gray-600'}>Mensual</span>
        <button 
          onClick={() => setIsAnnual(!isAnnual)} 
          className="relative w-14 h-7 bg-[#0066FF] rounded-full transition-colors"
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`}></div>
        </button>
        <span className={isAnnual ? 'font-bold text-gray-900' : 'text-gray-600'}>
          Anual <span className="text-[#0066FF]">(Ahorra 10%)</span>
        </span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {planes.map((plan) => {
          const price = isAnnual ? plan.precioAnual / 12 : plan.precioMensual;
          const features = getPlanFeatures(plan);
          
          return (
            <div 
              key={plan.idPlan} 
              className={`bg-white p-6 rounded-xl ${plan.destacado ? 'ring-2 ring-[#0066FF] shadow-xl' : 'shadow-sm'} relative border`}
            >
              {plan.destacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Más popular
                </div>
              )}
              <h3 className="text-xl font-bold text-[#1A2332] mb-3">{plan.nombre}</h3>
              <div className="mb-4">
                {plan.precioMensual > 0 ? (
                  <div>
                    <div className="text-4xl font-bold text-[#1A2332]">
                      {plan.moneda === 'USD' ? '$' : plan.moneda}{price.toFixed(2)}<span className="text-lg text-gray-600">/mes</span>
                    </div>
                    {isAnnual && plan.precioAnual > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 line-through">{plan.moneda === 'USD' ? '$' : plan.moneda}{plan.precioMensual * 12}/año</p>
                        <p className="text-base font-semibold text-[#0066FF]">{plan.moneda === 'USD' ? '$' : plan.moneda}{plan.precioAnual.toFixed(2)}/año</p>
                        {plan.precioMensual * 12 > plan.precioAnual && (
                          <p className="text-xs text-green-600 mt-1">
                            Ahorras {plan.moneda === 'USD' ? '$' : plan.moneda}{(plan.precioMensual * 12 - plan.precioAnual).toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-[#1A2332]">Contactános</div>
                )}
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#0066FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-xs">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onPlanSelect(plan.nombre, plan.precioMensual > 0 ? price : null, plan, isAnnual)}
                className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                  plan.destacado 
                    ? 'bg-[#0066FF] hover:bg-[#0052CC] text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-[#1A2332]'
                }`}
              >
                {plan.precioMensual > 0 ? 'Comenzar' : 'Contactános'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({ open, onOpenChange }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SuscripcionDTO | null>(null);
  const [planes, setPlanes] = useState<PlanSuscripcionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadSubscription();
      loadPlans();
    }
  }, [open, profile?.idCooperativa]);

  const loadSubscription = async () => {
    if (!profile?.idCooperativa) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.getActiveSubscriptionByCooperativa(profile.idCooperativa);
      if (response.isSuccess && response.data) {
        setSubscription(response.data);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error al cargar suscripción:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const response = await apiService.getAllPlanesSuscripcion();
      if (response.isSuccess && response.data) {
        setPlanes(response.data.filter(p => p.activo));
      }
    } catch (error) {
      console.error('Error al cargar planes:', error);
    }
  };

  const handlePlanClick = (
    planName: string, 
    planPrice: number | null, 
    plan: PlanSuscripcionDTO,
    isAnnual: boolean
  ) => {
    onOpenChange(false);
    
    if (plan.precioMensual > 0) {
      navigate('/payment', { 
        state: { 
          price: planPrice, 
          period: isAnnual ? 'annual' : 'monthly',
          planName: planName,
          planId: plan.idPlan,
          monthlyPrice: plan.precioMensual,
          annualPrice: plan.precioAnual,
          moneda: plan.moneda
        } 
      });
    } else if (plan.tipoPlan === 'custom') {
      const subject = encodeURIComponent('Solicitud de Plan Custom - Ana-OS');
      const body = encodeURIComponent(`Hola,\n\nEstoy interesado en el plan Custom de Ana-OS.\n\nPor favor, contactarme para más información sobre:\n- Despliegue personalizado\n- Número de usuarios\n- Información personalizada\n- Información sobre inversiones\n\nGracias.`);
      window.location.href = `mailto:soporte@anaos.com?subject=${subject}&body=${body}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleRenew = async () => {
    if (!subscription) return;
    
    try {
      const response = await apiService.renewSubscription(subscription.idSuscripcion);
      if (response.isSuccess) {
        toast.success('Suscripción renovada', 'La suscripción se ha renovado exitosamente.');
        loadSubscription();
      } else {
        toast.error('Error', response.message || 'No se pudo renovar la suscripción.');
      }
    } catch (error) {
      toast.error('Error', 'Error al renovar la suscripción.');
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    
    if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) {
      return;
    }

    try {
      const response = await apiService.cancelSuscripcion(subscription.idSuscripcion);
      if (response.isSuccess) {
        toast.success('Suscripción cancelada', 'La suscripción se ha cancelado exitosamente.');
        loadSubscription();
      } else {
        toast.error('Error', response.message || 'No se pudo cancelar la suscripción.');
      }
    } catch (error) {
      toast.error('Error', 'Error al cancelar la suscripción.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activa</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expirada</Badge>;
      case 'canceled':
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>;
      case 'past_due':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pago Vencido</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspendida</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPeriodoLabel = (periodo: string) => {
    const periodoLower = periodo.toLowerCase();
    if (periodoLower === 'monthly' || periodoLower === 'mensual') return 'Mensual';
    if (periodoLower === 'annual' || periodoLower === 'anual') return 'Anual';
    return periodo;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1A2332]">
            Gestión de Suscripción
          </DialogTitle>
          <DialogDescription>
            {subscription 
              ? 'Información de tu suscripción actual' 
              : 'Selecciona un plan para comenzar'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066FF]"></div>
          </div>
        ) : subscription ? (
          <div className="space-y-6">
            {/* Información de la suscripción */}
            <div className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{subscription.nombrePlan || 'Plan'}</h3>
                  {subscription.tipoPlan && (
                    <Badge className="bg-white/20 text-white border-white/30 mb-2">
                      {subscription.tipoPlan.charAt(0).toUpperCase() + subscription.tipoPlan.slice(1)}
                    </Badge>
                  )}
                  {getStatusBadge(subscription.estado)}
                </div>
                <CreditCard className="w-12 h-12 opacity-80" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Periodo</p>
                  <p className="text-lg font-semibold">{getPeriodoLabel(subscription.periodo)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Precio</p>
                  <p className="text-lg font-semibold">
                    {subscription.moneda === 'USD' ? '$' : subscription.moneda}{subscription.montoPagado.toFixed(2)}
                    <span className="text-sm opacity-90">/{subscription.periodo.toLowerCase() === 'annual' || subscription.periodo.toLowerCase() === 'anual' ? 'año' : 'mes'}</span>
                  </p>
                </div>
              </div>
              {subscription.renovacionAutomatica && (
                <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                  <RefreshCw className="w-4 h-4" />
                  <span>Renovación automática activada</span>
                </div>
              )}
              {subscription.estaPorVencer && subscription.diasRestantes !== undefined && (
                <div className="mt-4 flex items-center gap-2 text-sm bg-yellow-500/20 rounded p-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Vence en {subscription.diasRestantes} días</span>
                </div>
              )}
            </div>

            {/* Detalles de la suscripción */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[#0066FF]" />
                  <h4 className="font-semibold text-gray-900">Fecha de Inicio</h4>
                </div>
                <p className="text-gray-600">{formatDate(subscription.fechaInicio)}</p>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[#0066FF]" />
                  <h4 className="font-semibold text-gray-900">
                    {subscription.estado.toLowerCase() === 'active' ? 'Fecha de Expiración' : 'Fecha de Expiración'}
                  </h4>
                </div>
                <p className="text-gray-600">{formatDate(subscription.fechaFin)}</p>
              </div>

              {subscription.proximaFechaCobro && (
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-[#0066FF]" />
                    <h4 className="font-semibold text-gray-900">Próxima Fecha de Cobro</h4>
                  </div>
                  <p className="text-gray-600">{formatDate(subscription.proximaFechaCobro)}</p>
                </div>
              )}

              {subscription.fechaCancelacion && (
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-gray-900">Fecha de Cancelación</h4>
                  </div>
                  <p className="text-gray-600">{formatDate(subscription.fechaCancelacion)}</p>
                </div>
              )}
            </div>

            {subscription.metodoPago && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Método de Pago</h4>
                <p className="text-gray-600">{subscription.metodoPago}</p>
                {subscription.ultimos4Digitos && (
                  <p className="text-sm text-gray-500 mt-1">Terminada en {subscription.ultimos4Digitos}</p>
                )}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  navigate('/payment');
                }}
              >
                Cambiar Plan
              </Button>
              {subscription.estado.toLowerCase() === 'active' && subscription.renovacionAutomatica && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleRenew}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Renovar Ahora
                </Button>
              )}
              {subscription.estado.toLowerCase() === 'active' && (
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleCancel}
                >
                  Cancelar Suscripción
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <XCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes una suscripción activa
              </h3>
              <p className="text-gray-600">
                Selecciona un plan para comenzar a disfrutar de todos los beneficios de Ana-OS
              </p>
            </div>
            <PricingPlans onPlanSelect={handlePlanClick} planes={planes} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

