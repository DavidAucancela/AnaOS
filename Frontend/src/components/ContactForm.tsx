import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', institution: '', role: '', size: '', message: '', consent: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.consent) {
      alert('Please fill in all required fields and accept the terms.');
      return;
    }
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2332] mb-4">Request a Demo</h2>
          <p className="text-xl text-gray-600">See how our platform can transform your financial operations</p>
        </div>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
            <p className="text-xl font-semibold">Thank you! We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#F5F7FA] p-8 rounded-xl space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]" required />
              <input type="email" placeholder="Email Address *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]" required />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Institution Name" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]" />
              <input type="text" placeholder="Your Role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]" />
            </div>
            <select value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
              <option value="">Institution Size</option>
              <option value="small">1-50 employees</option>
              <option value="medium">51-200 employees</option>
              <option value="large">201-1000 employees</option>
              <option value="enterprise">1000+ employees</option>
            </select>
            <textarea placeholder="Tell us about your needs" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"></textarea>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} className="mt-1" required />
              <span className="text-sm text-gray-600">I agree to receive communications and accept the privacy policy *</span>
            </label>
            <button type="submit" className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-4 rounded-lg font-semibold transition-all">Submit Request</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm;
