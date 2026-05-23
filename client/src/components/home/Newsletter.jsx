import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMailOpen } from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'react-toastify';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Changed from /api/newsletter/subscribe to /api/newsletter/subscribe
      // Since index.js mounts apiRoutes at /api, and api.js defines /newsletter/subscribe
      const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      toast.success(response.data.message);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-2 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[40px] bg-blue-600 p-6 md:p-12 overflow-hidden shadow-2xl shadow-blue-600/30">
          {/* Background Decorative */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-[18px] flex items-center justify-center text-white mx-auto mb-4 border border-white/30"
            >
              <HiOutlineMailOpen size={24} />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight"
            >
              Get Technical <br /> <span className="text-blue-200 italic">Updates & Insights</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-blue-100 text-sm mb-6 font-medium"
            >
              Join 5,000+ industry professionals receiving the latest equipment releases, 
              maintenance guides, and exclusive enterprise offers directly.
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
              onSubmit={handleSubmit}
            >
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-8 py-4 bg-white rounded-[20px] text-slate-900 font-bold focus:outline-none shadow-2xl placeholder:text-slate-400"
              />
              <button 
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-8 bg-blue-600 text-white font-black rounded-[16px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-blue-200 text-xs font-bold uppercase tracking-widest opacity-60"
            >
              NO SPAM. ONLY PROFESSIONAL UPDATES.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
