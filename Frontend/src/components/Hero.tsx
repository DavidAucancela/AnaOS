import React from 'react';
const Hero: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section id="information" className="bg-gradient-to-br from-[#1A2332] via-[#243447] to-[#1A2332] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">Transforma Datos Financieros en Inteligencia Estrategica</h1>
          <p className="text-xl text-gray-300">Sistema de gestión de información financiera de nivel empresarial en el que confían las principales instituciones financieras de la EPS. Automatice el cumplimiento normativo, obtenga información valiosa e impulse el crecimiento.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={scrollToPricing} className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105">Precios</button>
          </div>
        </div>
        <div className="relative">
          <img src="https://d64gsuwffb70l.cloudfront.net/6908b60d968e95bec56eeca5_1762178625916_a99b7c42.webp" alt="Financial Dashboard" className="rounded-xl shadow-2xl" />
        </div>
      </div>
    </section>;
};
export default Hero;