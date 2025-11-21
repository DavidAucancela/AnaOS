import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(true);
  
  const handlePlanClick = (planName: string, planPrice: number | null, plan: { monthlyPrice?: number; annualPrice?: number }) => {
    // Verificar si el usuario está autenticado antes de proceder al pago
    if (!user && planName !== 'Custom') {
      // Guardar la información del plan para después del login
      sessionStorage.setItem('pendingPayment', JSON.stringify({
        planName,
        price: planPrice,
        period: isAnnual ? 'anual' : 'mensual',
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice
      }));
      navigate('/login', { state: { redirectTo: `/payment/${planName.toLowerCase()}` } });
      return;
    }

    if (planName === 'Professional' || planName === 'Enterprise') {
      navigate('/payment', { 
        state: { 
          price: planPrice, 
          period: isAnnual ? 'anual' : 'mensual',
          planName: planName,
          monthlyPrice: plan.monthlyPrice,
          annualPrice: plan.annualPrice
        } 
      });
    } else if (planName === 'Custom') {
      // Abrir correo para contactar con soporte técnico
      const subject = encodeURIComponent('Solicitud de Plan Custom - Ana-OS');
      const body = encodeURIComponent(`Hola,\n\nEstoy interesado en el plan Custom de Ana-OS.\n\nPor favor, contactarme para más información sobre:\n- Despliegue personalizado\n- Número de usuarios\n- Información personalizada\n- Información sobre inversiones\n\nGracias.`);
      window.location.href = `mailto:soporte@anaos.com?subject=${subject}&body=${body}`;
    }
  };

  // Precios base mensuales
  const monthlyPrices = {
    Professional: 80,
    Enterprise: 240
  };

  const plans = [{
    name: 'Professional',
    monthlyPrice: monthlyPrices.Professional,
    annualPrice: monthlyPrices.Professional * 12 * 0.9, // 10% descuento
    price: isAnnual ? 72 : 80,
    features: ['Información Entidades financieras populares y solidarias (histórico 5 años)', 'Información de captación y colocación de crédito por provincia', 'Información de tasas de interés', 'Consultas ilimitadas', 'Soporte por email', 'Reportes mensuales']
  }, {
    name: 'Enterprise',
    monthlyPrice: monthlyPrices.Enterprise,
    annualPrice: monthlyPrices.Enterprise * 12 * 0.9, // 10% descuento
    price: isAnnual ? 216 : 240,
    popular: true,
    features: ['Información Entidades financieras populares y solidarias (histórico 5 años)', 'Información nacional de empresas por sector económico (histórico 5 años)', 'Información de captación y colocación de crédito por provincia', 'Base de datos macroeconómicos', 'Información de tasas de interés', 'Consultas ilimitadas', 'Soporte por email', 'Reportes mensuales']
  }, {
    name: 'Custom',
    price: null,
    features: ['Todo lo que se incluye en el plan Professional o Enterprise', 'Despliegue personalizado para la cooperativa por número de usuario', 'Carga de información personalizada de la cooperativa.', 'Información sobre inversiones', 'Valores a acordar según requerimientos del cliente']
  }];
  return <section id="pricing" className="bg-[#F5F7FA] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2332] mb-4">Simple, precios transparentes y accesibles</h2>
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={!isAnnual ? 'font-bold' : 'text-gray-600'}>Mensual</span>
            <button onClick={() => setIsAnnual(!isAnnual)} className="relative w-14 h-7 bg-[#0066FF] rounded-full transition-colors">
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
            <span className={isAnnual ? 'font-bold' : 'text-gray-600'}>Anual <span className="text-[#0066FF]">(Ahorra 10%)</span></span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => <div key={index} className={`bg-white p-8 rounded-xl ${plan.popular ? 'ring-2 ring-[#0066FF] shadow-xl' : 'shadow-sm'} relative`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white px-4 py-1 rounded-full text-sm font-semibold">Mas popular</div>}
              <h3 className="text-2xl font-bold text-[#1A2332] mb-4">{plan.name}</h3>
              <div className="mb-6">
                {plan.price ? (
                  <div>
                    <div className="text-5xl font-bold text-[#1A2332]" data-mixed-content="true">
                      ${plan.price}<span className="text-xl text-gray-600">/mes</span>
                    </div>
                    {isAnnual && plan.annualPrice && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 line-through">${plan.monthlyPrice * 12}/año</p>
                        <p className="text-lg font-semibold text-[#0066FF]">${plan.annualPrice.toFixed(0)}/año</p>
                        <p className="text-xs text-green-600 mt-1">Ahorras ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(0)}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-[#1A2332]">Contactános</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#0066FF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>)}
              </ul>
              <button 
                onClick={() => handlePlanClick(plan.name, plan.price, plan)}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-[#0066FF] hover:bg-[#0052CC] text-white' : 'bg-gray-100 hover:bg-gray-200 text-[#1A2332]'}`}
              >
                {plan.price ? 'Comenzar' : 'Contactános'}
              </button>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Pricing;