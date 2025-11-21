import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { value: '500+', label: 'Financial Institutions' },
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '$2B+', label: 'Managed Daily' },
    { value: '24/7', label: 'Expert Support' }
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0066FF] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
