import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { user, resendVerificationEmail, emailVerified } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    
    const { error: resendError } = await resendVerificationEmail();
    
    if (resendError) {
      setError(resendError.message);
    } else {
      setMessage('Verification email sent! Check your inbox.');
    }
    setLoading(false);
  };

  if (emailVerified) {
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
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error al procesar pago pendiente:', err);
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We sent a verification link to <strong>{user?.email}</strong>
          </p>
        </div>

        {message && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Click the verification link in your email to activate your account. 
              If you don't see it, check your spam folder.
            </p>
          </div>

          <Button 
            onClick={handleResend} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>

          <Button 
            onClick={() => navigate('/login')}
            className="w-full"
            variant="ghost"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
