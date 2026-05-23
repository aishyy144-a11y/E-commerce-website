import React from 'react';
import { motion } from 'framer-motion';

const brands = [];

const TrustedBrands = () => {
  if (brands.length === 0) return null;
  return (
    <section className="py-2 bg-white border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Industrial Partners</p>
          <h3 className="text-3xl font-black text-slate-900">Authorized Distributors for <span className="text-blue-600">Global Brands</span></h3>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-8 md:h-12"
            >
              <img src={brand.logo} alt={brand.name} className="h-full w-auto object-contain" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;
