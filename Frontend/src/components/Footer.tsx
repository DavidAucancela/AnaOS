import React from 'react';
const Footer: React.FC = () => {
  return <footer className="bg-[#1A2332] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">Ana-OS</h3>
            <p className="text-gray-400">Enterprise financial information management for modern institutions.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">Integraciones</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Seguridad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#banks" className="hover:text-white transition-colors">Cooperativas segmento 1</a></li>
              <li><a href="#credit-unions" className="hover:text-white transition-colors">Cooperativas segmento 2</a></li>
              <li><a href="#brokerages" className="hover:text-white transition-colors">Cooperativas segmento 3</a></li>
              <li><a href="#fintech" className="hover:text-white transition-colors">Segmentos inferiores</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">La Empresa</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">Acerca de nosotros</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Carrera</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 SMARTDATA SERVICES. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>SOC 2 Type II Certified</span>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;