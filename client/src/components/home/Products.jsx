import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineEye, HiOutlineChevronRight, HiOutlineArrowRight, HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

import { ProductCardSkeleton } from '../common/Skeleton';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const response = await api.get('/api/products/all?limit=8');
      return response.data;
    }
  });

  if (isLoading) return (
    <section className="py-4 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-4 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-8">
          <div className="text-center md:text-left">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block"
            >
              Inventory Update
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-slate-900 mb-4 md:mb-6"
            >
              Latest <span className="text-blue-600 italic">Products</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-base md:text-lg max-w-xl font-medium"
            >
              Discover our newest arrivals in high-grade technical equipment and specialized industrial components.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/shop"
              className="px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 rounded-2xl md:rounded-[24px] font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-slate-200 border border-slate-100 hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              View All Products
              <HiOutlineArrowRight size={18} className="md:size-[20px]" />
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl md:rounded-[32px] p-2 md:p-4 shadow-sm hover:shadow-2xl transition-all group border border-slate-100 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative aspect-square rounded-xl md:rounded-[24px] overflow-hidden mb-3 md:mb-4 bg-slate-50">
                  <Link to={`/product/${product.slug}`} state={{ from: location.pathname }}>
                    <img 
                      src={product.images[0] || 'https://via.placeholder.com/400'} 
                      alt={product.name}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                    />
                  </Link>
                  
                  {/* Badges */}
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-col gap-1 md:gap-2">
                    <span className="px-2 py-1 md:px-3 md:py-1.5 bg-white/90 backdrop-blur-md text-blue-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-md md:rounded-lg shadow-sm border border-blue-50">
                      {product.brand}
                    </span>
                    {product.requiresQuote && (
                      <span className="px-2 py-1 md:px-3 md:py-1.5 bg-amber-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-md md:rounded-lg shadow-sm">
                        Quote
                      </span>
                    )}
                  </div>

                  {/* Floating Wishlist Button for Mobile (Always Visible) */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (!user) {
                        navigate('/login', { state: { from: location.pathname } });
                      } else {
                        toggleWishlist(product);
                      }
                    }}
                    className={`absolute top-2 right-2 p-1.5 md:hidden rounded-full shadow-md bg-white/90 backdrop-blur-sm transition-all z-20 ${
                      isInWishlist(product._id) ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                    }`}
                  >
                    {isInWishlist(product._id) ? <HiHeart size={16} /> : <HiOutlineHeart size={16} />}
                  </button>

                  {/* Hover Quick Actions - Adjusted for Mobile (always visible or tap) */}
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 md:gap-3">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (!user) {
                          navigate('/login', { state: { from: location.pathname } });
                        } else {
                          toggleWishlist(product);
                        }
                      }}
                      className={`p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl transition-all transform translate-y-8 md:group-hover:translate-y-0 duration-500 ${
                        isInWishlist(product._id) 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-slate-900 hover:bg-primary hover:text-white'
                      }`}
                    >
                      {isInWishlist(product._id) ? <HiHeart size={18} className="md:size-[24px]" /> : <HiOutlineHeart size={18} className="md:size-[24px]" />}
                    </button>
                    <Link 
                      to={`/product/${product.slug}`}
                      state={{ from: location.pathname }}
                      className="p-2 md:p-4 bg-white text-slate-900 rounded-xl md:rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-8 md:group-hover:translate-y-0 duration-500 delay-75"
                    >
                      <HiOutlineEye size={18} className="md:size-[24px]" />
                    </Link>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-grow">
                  <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                    <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.2em] truncate">
                      {product.category?.name || 'Industrial'}
                    </span>
                  </div>
                  
                  <Link to={`/product/${product.slug}`} state={{ from: location.pathname }}>
                    <h3 className="text-sm md:text-xl font-black text-slate-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Bottom Section */}
                <div className="pt-2 md:pt-4 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-base md:text-2xl font-black text-slate-900 tracking-tighter">Rs {product.price.toLocaleString()}</span>
                  </div>
                  
                  <Link 
                    to={`/product/${product.slug}`}
                    state={{ from: location.pathname }}
                    className="flex items-center gap-1 md:gap-2 text-blue-600 font-black text-[9px] md:text-[10px] uppercase tracking-widest group/btn"
                  >
                    Details
                    <HiOutlineChevronRight className="group-hover/btn:translate-x-1 transition-transform md:size-[16px]" size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Background Decorative */}
        <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
    </section>
  );
};

export default Products;
