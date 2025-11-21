import React from 'react';
import { Database, MapPin, Infinity as InfinityIcon, FileText, Headphones, RefreshCw } from 'lucide-react';

const Features: React.FC = () => {
  const features = [{
    icon: Database,
    title: 'Información Financiera Histórica',
    description: 'Acceso a 5 años de datos históricos de entidades financieras, tasas de interés y variables macroeconómicas. Integraciones automatizadas y estructura optimizada por año, provincia y sector.'
  }, {
    icon: MapPin,
    title: 'Análisis Territorial',
    description: 'Análisis completo de captación y colocación de crédito por provincia y cantón. Indicadores financieros territoriales con dashboards comparativos e históricos.'
  }, {
    icon: InfinityIcon,
    title: 'Consultas Ilimitadas',
    description: 'Consultas sin límites según tu plan. APIs optimizadas, indexación avanzada y caching inteligente para respuestas rápidas.'
  }, {
    icon: FileText,
    title: 'Reportes Automatizados',
    description: 'Generación automática de reportes en PDF o Excel con datos financieros, territoriales y macroeconómicos. Plantillas personalizables y programación flexible.'
  }, {
    icon: Headphones,
    title: 'Soporte Integral',
    description: 'Sistema de soporte integrado con gestión de tickets y comunicación directa. Seguimiento completo de solicitudes y respuesta rápida.'
  }, {
    icon: RefreshCw,
    title: 'Datos en Tiempo Real',
    description: 'Actualización constante mediante crawlers y APIs externas. Pipelines automatizados que garantizan información precisa y actualizada.'
  }];

  return (
    <section id="features" className="bg-gradient-to-b from-[#F5F7FA] to-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2332] mb-4">
            Capacidades de alto nivel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Todo lo que su institución necesita para gestionar los datos financieros de forma eficiente y segura.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#0066FF]/10 flex items-center justify-center group-hover:bg-[#0066FF] transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1A2332] mb-2 group-hover:text-[#0066FF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;