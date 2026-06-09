import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Redirige a /payment con los valores por defecto del plan Enterprise.
// Payment.tsx maneja la lógica real para todos los planes.
export default function PaymentEnterprise() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state ?? {};
    navigate('/payment', {
      replace: true,
      state: {
        price: state.price ?? 216,
        period: state.period ?? 'anual',
        planName: state.planName ?? 'Enterprise',
        monthlyPrice: state.monthlyPrice ?? 240,
        annualPrice: state.annualPrice ?? 2592,
      },
    });
  }, []);

  return null;
}
