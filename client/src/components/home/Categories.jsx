import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  HiOutlineLightningBolt, 
  HiOutlineSupport, 
  HiOutlineDesktopComputer, 
  HiOutlineSparkles, 
  HiOutlineClock, 
  HiOutlineShoppingBag,
  HiArrowRight,
  HiOutlineCube
} from 'react-icons/hi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return (
    <div className="py-24 bg-white flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <section className="py-4 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block"
            >
              Industry Verticals
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-900 leading-tight"
            >
              Solutions by <span className="text-blue-600 italic relative">
                Category
                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="#DBEAFE" strokeWidth="4" />
                </svg>
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/shop" className="group flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-xs md:text-sm hover:text-blue-600 transition-colors">
              View All Inventory
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <HiArrowRight size={16} className="md:size-[20px]" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[300px] md:h-[400px]"
            >
              <Link to={`/category/${cat.slug}`} className="block h-full">
                {/* Main Card */}
                <div className={`relative h-full rounded-[32px] md:rounded-[48px] overflow-hidden bg-white border border-slate-100 shadow-xl md:shadow-2xl transition-all duration-700 md:group-hover:-translate-y-4 group-hover:shadow-blue-600/20`}>
                  {/* Background Image with Zoom and Overlay */}
                  <div className="absolute inset-0">
                    <img 
                      src={cat.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'} 
                      alt={cat.name} 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 transition-opacity duration-500" />
                  </div>

                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    {/* Glass Icon */}
                    <div className="mb-3 md:mb-4 w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/20 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
                      <HiOutlineCube size={24} className="md:size-[32px]" />
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white mb-1 md:mb-2 group-hover:text-blue-100 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="hidden md:block text-slate-300 text-sm font-medium leading-relaxed mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      {cat.description}
                    </p>

                    <div className="flex items-center gap-2 text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                      Explore Sector
                      <HiArrowRight size={14} className="group-hover:translate-x-2 transition-transform md:size-[16px]" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );};

export default Categories;
