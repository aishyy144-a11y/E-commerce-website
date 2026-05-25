import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { 
  HiOutlineCollection, 
  HiOutlineCube, 
  HiOutlineSupport, 
  HiOutlineLightBulb 
} from 'react-icons/hi';

const StatsSection = () => {
  const [counts, setCounts] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/public/stats');
        setCounts(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      label: 'Categories',
      value: `${counts.categories}+`,
      description: 'Specialized Industrial Sectors',
      icon: <HiOutlineCollection size={28} />,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      label: 'Products',
      value: `${counts.products}+`,
      description: 'Professional Grade Items',
      icon: <HiOutlineCube size={28} />,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      label: 'Support',
      value: '24/7',
      description: 'Technical Expert Assistance',
      icon: <HiOutlineSupport size={28} />,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      label: 'Solutions',
      value: 'Custom',
      description: 'Enterprise Integration',
      icon: <HiOutlineLightBulb size={28} />,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    }
  ];

  return (
    <section className="py-4 md:py-2 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-3 md:p-8 rounded-2xl md:rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-slate-100 group"
            >
              <div className={`w-8 h-8 md:w-16 md:h-16 rounded-lg md:rounded-2xl flex items-center justify-center mb-2.5 md:mb-6 border transition-all duration-500 ${stat.color} group-hover:scale-110 group-hover:rotate-6`}>
                <div className="scale-[0.6] md:scale-100 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <h4 className="text-xl md:text-4xl font-black text-slate-900 mb-0.5 tracking-tighter">
                {stat.value}
              </h4>
              <p className="text-[8px] md:text-sm font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-4">
                {stat.label}
              </p>
              <p className="hidden md:block text-slate-500 font-medium leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
