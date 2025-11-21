import React from 'react';
const Testimonials: React.FC = () => {
  const testimonials = [{
    quote: 'This platform has transformed how we manage financial data. The compliance automation alone has saved us thousands of hours.',
    author: 'Sarah Chen',
    role: 'CTO, Global Financial Services',
    image: 'https://d64gsuwffb70l.cloudfront.net/6908b60d968e95bec56eeca5_1762178626704_980c9224.webp'
  }, {
    quote: 'The real-time analytics and reporting capabilities have given us a competitive edge. Implementation was seamless.',
    author: 'Michael Rodriguez',
    role: 'VP Operations, Premier Bank',
    image: 'https://d64gsuwffb70l.cloudfront.net/6908b60d968e95bec56eeca5_1762178628438_919fd1b0.webp'
  }, {
    quote: 'Outstanding security and reliability. The support team is incredibly responsive and knowledgeable.',
    author: 'Jennifer Thompson',
    role: 'Chief Risk Officer, Capital Trust',
    image: 'https://d64gsuwffb70l.cloudfront.net/6908b60d968e95bec56eeca5_1762178630182_6bb68c23.webp'
  }];
  return <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2332] mb-4">Con la confianza de entidades líderes</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-[#F5F7FA] p-8 rounded-xl">
              <p className="text-gray-700 mb-6 italic" data-mixed-content="true">{testimonial.quote}"Esta Plataforma ha transformado la manera en que analizamos nuestra información financiera"</p>
              <div className="flex items-center gap-4">
                <img src={testimonial.image} alt={testimonial.author} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-[#1A2332]">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Testimonials;