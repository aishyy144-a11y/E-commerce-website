import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineChatAlt, HiOutlineChevronDown, HiOutlineCheckCircle, HiOutlineGlobe } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';

const ContactCard = ({ icon: Icon, title, info, subInfo, color = "primary", href }) => {
  const CardContent = (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-${color}-100 bg-${color}-50 text-${color} flex-shrink-0`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-1">{title}</h3>
      <p className={`text-[11px] font-black text-primary mb-2 break-all leading-tight ${info.includes('@') ? '' : 'uppercase tracking-widest'}`}>
        {info}
      </p>
      <p className="text-gray-400 text-[10px] font-bold leading-relaxed mt-auto">{subInfo}</p>
    </motion.div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        target={href.startsWith('http') ? "_blank" : undefined} 
        rel={href.startsWith('http') ? "noopener noreferrer" : undefined} 
        className="block h-full"
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className={`text-lg font-black transition-colors ${isOpen ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
          {question}
        </span>
        <HiOutlineChevronDown className={`w-6 h-6 text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-500 font-medium leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/inquiries', {
        ...formData,
        phone: formData.phone || 'Not Provided' // Add phone field if missing
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { question: 'Do you offer bulk enterprise pricing?', answer: 'Yes, we specialize in bulk orders for industrial sectors. Please use the "Request Quotation" button on any product page for a custom quote.' },
    { question: 'What is the standard delivery time for technical items?', answer: 'Standard technical items are shipped within 24-48 hours. Large infrastructure items may require 7-14 business days depending on logistics.' },
    { question: 'Are you an authorized distributor?', answer: 'We are authorized distributors for premium brands including DJI Enterprise, Hikvision, ICOM, and Panasonic.' },
    { question: 'Do you provide on-site technical support?', answer: 'Yes, we have a team of field engineers available for drone calibration, radio system setup, and surveillance network configuration.' }
  ];

  return (
    <div className="pt-28 md:pt-32">
      {/* Header Section */}
      <section className="bg-white py-10 md:py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 block"
          >
            Get In Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4"
          >
            How can we <span className="text-primary italic">support you?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-base font-medium max-w-2xl mx-auto mb-6"
          >
            Our technical operations team is available 24/7 to assist with product inquiries, 
            bulk orders, and system implementation support.
          </motion.p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 -mt-10 relative z-20">
            <ContactCard 
              icon={HiOutlinePhone} 
              title="Call Operations" 
              info="03117702133" 
              subInfo="Available Mon-Sat, 9am - 9pm for technical consultation." 
              href="tel:03117702133"
            />
            <ContactCard 
              icon={HiOutlineMail} 
              title="Email Support" 
              info="innovativesolutions.support.pk@gmail.com" 
              subInfo="We aim to respond to all technical inquiries within 24 hours." 
              color="blue"
              href="mailto:innovativesolutions.support.pk@gmail.com"
            />
            <ContactCard 
              icon={HiOutlineLocationMarker} 
              title="Global HQ" 
              info="Civic Center, Township, Lahore" 
              subInfo="Innovative Solutions, Main Branch. Open for logistics pickups." 
              color="indigo"
              href="https://www.google.com/maps/search/?api=1&query=Civic+Center,+Township,+Lahore"
            />
            <ContactCard 
              icon={HiOutlineChatAlt} 
              title="Live Support" 
              info="Active 24/7" 
              subInfo="Use our secure customer portal for real-time order tracking." 
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Send an Inquiry</h2>
                <p className="text-gray-500 font-medium">Fill out the form below for general inquiries or project support.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                      <input 
                        required
                        type="email"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                        placeholder="e.g. Bulk Quotation Request"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                    <textarea 
                      required
                      rows="6"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                      placeholder="Describe your project requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Submit Secure Inquiry'
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 p-12 rounded-[40px] text-center border border-green-100"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-green-500 mx-auto mb-6 shadow-lg shadow-green-200/50">
                    <HiOutlineCheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-green-900 mb-2">Message Received</h3>
                  <p className="text-green-700 font-medium">Thank you for reaching out. Our operations team will contact you within 24 hours.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-xs font-black text-green-800 uppercase tracking-widest hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </div>

            {/* FAQ */}
            <div className="space-y-12">
              <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  Common Inquiries
                </h3>
                <div className="divide-y divide-gray-50">
                  {faqs.map((faq, i) => (
                    <FAQItem key={i} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
