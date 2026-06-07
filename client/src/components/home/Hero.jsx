import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineCube, HiOutlineShieldCheck, HiOutlineStatusOnline } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import generalImg from '../../assets/general.png';

const Hero = () => {
  return (
    <section className="relative min-h-0 lg:min-h-[70vh] flex items-center pt-0 overflow-hidden bg-white">
      {/* Background Gradients & Illustrations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[100px]" />
        
        {/* Animated Tech Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1E40AF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-2 pb-4 md:py-12 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Content Left */}
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4 md:mb-8 shadow-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                Next-Gen Industrial Solutions
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[1] mb-4 md:mb-8 tracking-tighter">
                Advanced <span className="text-blue-600">Equipment</span> & <br className="hidden md:block" />
                Reliable Support
              </h1>
              
              <p className="text-sm sm:text-base md:text-xl text-slate-500 mb-6 md:mb-12 leading-relaxed font-medium px-2 md:px-0">
                Pioneering the future of industrial efficiency with elite drones, telecom infrastructure, 
                fiber optics, and enterprise surveillance systems tailored for professional excellence.
              </p>

              <div className="flex flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none"
                >
                  <Link 
                    to="/categories"
                    className="w-full px-4 md:px-10 py-3 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-[20px] font-black text-xs md:text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 group transition-all"
                  >
                    Categories
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none"
                >
                  <Link 
                    to="/shop"
                    className="w-full px-4 md:px-10 py-3 md:py-5 bg-white text-slate-900 border border-slate-200 rounded-xl md:rounded-[20px] font-black text-xs md:text-lg flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-all shadow-md shadow-slate-200/50"
                  >
                    Latest Products
                  </Link>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 md:mt-16 flex flex-row items-center justify-center lg:justify-start gap-6 md:gap-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
                    <HiOutlineShieldCheck size={16} className="md:size-[20px]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Certified</p>
                    <p className="text-xs md:text-sm font-black text-slate-900 leading-none">Enterprise</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 flex-shrink-0">
                    <HiOutlineStatusOnline size={16} className="md:size-[20px]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Shipping</p>
                    <p className="text-xs md:text-sm font-black text-slate-900 leading-none">Global</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image/Illustration Right */}
          <div className="relative mt-4 lg:mt-0 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Glass Card Container */}
              <div className="relative p-2.5 md:p-8 bg-white/40 backdrop-blur-3xl rounded-[28px] md:rounded-[60px] border border-white/50 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.08)] w-full max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-none mx-auto">
                <div className="relative rounded-[20px] md:rounded-[40px] overflow-hidden aspect-square bg-slate-100 shadow-inner group">
                  <img 
                    src={generalImg} 
                    alt="Industrial Technology" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-transparent"></div>
                </div>

                {/* Floating Elements - Hidden on mobile, visible on tablet/desktop */}
                <div className="absolute -top-6 md:-top-10 -right-4 md:-right-10 p-3 md:p-6 bg-white rounded-2xl md:rounded-[32px] shadow-2xl border border-slate-50 hidden md:flex items-center gap-2 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                    <HiOutlineCube size={24} className="md:size-[28px]" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</p>
                    <p className="text-sm md:text-lg font-black text-slate-900 leading-none">Elite Series</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-10 p-3 md:p-5 bg-slate-900 text-white rounded-2xl md:rounded-[32px] shadow-2xl hidden md:flex items-center gap-2 md:gap-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</p>
                    <p className="text-xs md:text-sm font-bold">24/7 Ops</p>
                  </div>
                </div>
              </div>

              {/* Background Shapes */}
              <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 md:w-80 md:h-80 bg-blue-600/5 rounded-full blur-[40px] md:blur-[80px]"></div>
              <div className="absolute -z-10 top-10 -left-10 w-32 h-32 md:w-64 md:h-64 bg-slate-200/50 rounded-full blur-[30px] md:blur-[60px]"></div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
