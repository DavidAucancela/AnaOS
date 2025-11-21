import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Verificar si hay un pago pendiente en sessionStorage
      const pendingPayment = sessionStorage.getItem('pendingPayment');
      
      if (pendingPayment) {
        try {
          const paymentData = JSON.parse(pendingPayment);
          const planName = paymentData.planName?.toLowerCase();
          
          // Limpiar el pendingPayment de sessionStorage
          sessionStorage.removeItem('pendingPayment');
          
          // Redirigir a la ruta de pago correspondiente
          if (planName === 'professional') {
            navigate('/payment/professional', {
              state: {
                price: paymentData.price,
                period: paymentData.period,
                planName: paymentData.planName,
                monthlyPrice: paymentData.monthlyPrice,
                annualPrice: paymentData.annualPrice
              }
            });
          } else if (planName === 'enterprise') {
            navigate('/payment/enterprise', {
              state: {
                price: paymentData.price,
                period: paymentData.period,
                planName: paymentData.planName,
                monthlyPrice: paymentData.monthlyPrice,
                annualPrice: paymentData.annualPrice
              }
            });
          } else {
            // Si no es un plan reconocido, ir al dashboard
            navigate('/dashboard');
          }
        } catch (err) {
          // Si hay error al parsear, ir al dashboard
          console.error('Error al procesar pago pendiente:', err);
          navigate('/dashboard');
        }
      } else {
        // Verificar si hay un redirectTo en el estado de navegación
        const redirectTo = (location.state as any)?.redirectTo;
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate('/dashboard');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda: Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-sm w-full bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Iniciar Sesión</h1>
            <p className="text-sm text-gray-600">Ingresa tus credenciales</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 text-sm">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 h-9"
                placeholder="tu@ejemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 text-sm">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 h-9"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link to="/reset-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-full h-9" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>

      {/* Columna derecha: Background */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/montanas.jpg)' }}
      >
      </div>
    </div>
  );
}
