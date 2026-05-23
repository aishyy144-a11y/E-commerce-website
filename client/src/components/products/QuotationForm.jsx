import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineX, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineUser, 
  HiOutlineOfficeBuilding,
  HiOutlineChatAlt,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import axios from 'axios';

const QuotationForm = ({ product, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: 1,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/inquiries', {
        ...formData,
        product: product._id
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-primary hover:text-white transition-all z-20 border border-gray-100"
        >
          <HiOutlineX size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {!submitted ? (
            <>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary-light text-primary rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                  Request Quotation
                </span>
                <h2 className="text-2xl font-black text-gray-900 mb-1 leading-tight tracking-tight">Get a Custom Quote</h2>
                <p className="text-xs text-gray-500 font-medium">For: <span className="text-primary font-bold">{product.name}</span></p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <div className="relative">
                      <input 
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-sm"
                        placeholder="Enter your full name"
                      />
                      <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                      <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-sm"
                        placeholder="Enter your email address"
                      />
                      <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                    <div className="relative">
                      <input 
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-sm"
                        placeholder="Enter your phone number"
                      />
                      <HiOutlinePhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Company Name</label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-sm"
                        placeholder="Enter company name (optional)"
                      />
                      <HiOutlineOfficeBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Quantity Needed</label>
                  <input 
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Your Message / Requirements</label>
                  <div className="relative">
                    <textarea 
                      required
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-sm"
                      placeholder="Tell us about your project requirements..."
                    ></textarea>
                    <HiOutlineChatAlt className="absolute left-3.5 top-3 text-gray-400" size={16} />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0 text-sm uppercase tracking-widest"
                >
                  {loading ? 'Submitting...' : 'Send Quotation Request'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500">
                <HiOutlineCheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Request Received!</h2>
              <p className="text-xs text-gray-500 font-medium mb-8 max-w-[240px] mx-auto leading-relaxed">
                Our technical team will review your requirements and contact you within 24 hours.
              </p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all text-sm"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuotationForm;
