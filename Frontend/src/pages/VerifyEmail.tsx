import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// El sistema usa JWT propio — no hay verificación de email.
// Esta página solo existe para manejar redirects de pago pendiente post-signup.
export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const pendingPayment = sessionStorage.getItem('pendingPayment');

    if (pendingPayment) {
      try {
        const { planName, price, period, monthlyPrice, annualPrice } = JSON.parse(pendingPayment);
        sessionStorage.removeItem('pendingPayment');
        const plan = planName?.toLowerCase();

        if (plan === 'professional') {
          navigate('/payment/professional', { state: { price, period, planName, monthlyPrice, annualPrice } });
          return;
        }
        if (plan === 'enterprise') {
          navigate('/payment/enterprise', { state: { price, period, planName, monthlyPrice, annualPrice } });
          return;
        }
      } catch {
        // pago pendiente malformado, ignorar
      }
    }

    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
}
