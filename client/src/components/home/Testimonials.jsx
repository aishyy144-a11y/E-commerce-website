import React from 'react';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi';

const testimonials = [];

const Testimonials = () => {
  if (testimonials.length === 0) return null;
  return (
    <section className="py-4 bg-slate-900 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-6 block"
          >
            Client Success
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-white"
          >
            Trusted by <span className="text-blue-400 italic">Industry Leaders</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all duration-500 group"
            >
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="text-blue-400" size={20} />
                ))}
              </div>
              
              <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-5 pt-8 border-t border-white/10">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-400/30">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-black">{t.name}</h4>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{t.role} @ {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
