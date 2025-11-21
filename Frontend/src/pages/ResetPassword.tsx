import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!email.trim()) {
      toast.error('Campo requerido', 'Por favor, ingresa tu correo electrónico');
      return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Correo inválido', 'Por favor, ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Verificando correo...');

    const { error } = await resetPassword(email);
    
    if (error) {
      toast.dismiss(loadingToast);
      toast.error('Error al restablecer', error.message || 'No se pudo procesar la solicitud. Por favor, intenta nuevamente.');
      setLoading(false);
    } else {
      toast.dismiss(loadingToast);
      toast.success(
        'Solicitud enviada',
        'Si el correo está registrado, recibirás un email con tu nueva contraseña. Revisa también la consola del servidor.'
      );
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitud Enviada</h1>
            <p className="text-gray-600 mb-6">
              Si el correo <strong>{email}</strong> está registrado en el sistema, recibirás un email con tu nueva contraseña.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              <strong>Nota:</strong> La nueva contraseña también aparecerá en la consola del servidor para propósitos de desarrollo.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                variant="outline"
                className="w-full"
              >
                Enviar otra solicitud
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restablecer Contraseña</h1>
          <p className="text-gray-600">Ingresa tu correo electrónico para recibir una nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="tu@ejemplo.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se enviará una nueva contraseña al correo registrado
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Procesando...' : 'Enviar Nueva Contraseña'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
