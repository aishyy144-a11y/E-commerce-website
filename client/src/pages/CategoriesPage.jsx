import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  HiOutlineDesktopComputer, 
  HiOutlineSparkles, 
  HiOutlineShoppingBag, 
  HiOutlineHome, 
  HiOutlineBookOpen,
  HiOutlineSupport,
  HiOutlineClock,
  HiOutlineLightningBolt
} from 'react-icons/hi';

const iconMap = {
  HiOutlineDesktopComputer: <HiOutlineDesktopComputer size={24} />,
  HiOutlineSparkles: <HiOutlineSparkles size={24} />,
  HiOutlineShoppingBag: <HiOutlineShoppingBag size={24} />,
  HiOutlineHome: <HiOutlineHome size={24} />,
  HiOutlineBookOpen: <HiOutlineBookOpen size={24} />,
  HiOutlineSupport: <HiOutlineSupport size={24} />,
  HiOutlineClock: <HiOutlineClock size={24} />,
  HiOutlineLightningBolt: <HiOutlineLightningBolt size={24} />
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-white pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Specialized <span className="text-primary italic">Equipment Categories</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Browse our technical inventory. From industrial drones to professional communication systems, we provide high-grade electronic solutions.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <Link to={`/category/${category.slug}`} className="block">
                <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-lg border border-gray-100 bg-white">
                  {/* Category Image - Using a default if not present */}
                  <img 
                    src={category.image || `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600`} 
                    alt={category.name}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/60 opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30">
                        {iconMap[category.iconName] || <HiOutlineShoppingBag size={24} />}
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                        {category.name}
                      </h3>
                    </div>
                    
                    <p className="text-white/80 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                      {category.description}
                    </p>
                    
                    <div className="mt-6 flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      Explore Inventory
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Promo Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-primary-light rounded-[40px] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">Need Technical Support?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md">Our engineers are ready to help you choose the right equipment for your specific technical requirements.</p>
            <Link 
              to="/contact"
              className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all inline-block"
            >
              Consult an Engineer
            </Link>
          </div>
          <div className="relative z-10 hidden lg:block">
            <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
              <HiOutlineSparkles size={80} className="text-primary" />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CategoriesPage;
