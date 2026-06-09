import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Redirige a /payment con los valores por defecto del plan Professional.
// Payment.tsx maneja la lógica real para todos los planes.
export default function PaymentProfessional() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state ?? {};
    navigate('/payment', {
      replace: true,
      state: {
        price: state.price ?? 72,
        period: state.period ?? 'anual',
        planName: state.planName ?? 'Professional',
        monthlyPrice: state.monthlyPrice ?? 80,
        annualPrice: state.annualPrice ?? 864,
      },
    });
  }, []);

  return null;
}
