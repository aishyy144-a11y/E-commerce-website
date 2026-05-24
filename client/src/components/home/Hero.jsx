import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineCube, HiOutlineShieldCheck, HiOutlineStatusOnline } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import generalImg from '../../assets/general.png';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center pt-0 overflow-hidden bg-white">
      {/* Background Gradients & Illustrations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[100px]"
        />
        
        {/* Animated Tech Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1E40AF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Left */}
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 md:mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                Next-Gen Industrial Solutions
              </span>
              
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[1] mb-6 md:mb-8 tracking-tighter">
                Advanced <span className="text-blue-600">Equipment</span> & <br className="hidden md:block" />
                <span className="relative inline-block">
                  Reliable Support
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="absolute bottom-1 md:bottom-2 left-0 h-2 md:h-3 bg-blue-100 -z-10"
                  ></motion.span>
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-slate-500 mb-8 md:mb-12 leading-relaxed font-medium px-4 md:px-0">
                Pioneering the future of industrial efficiency with elite drones, telecom infrastructure, 
                fiber optics, and enterprise surveillance systems tailored for professional excellence.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 items-center justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link 
                    to="/categories"
                    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-[18px] md:rounded-[20px] font-black text-base md:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 group transition-all"
                  >
                    Explore Categories
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link 
                    to="/shop"
                    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[18px] md:rounded-[20px] font-black text-base md:text-lg flex items-center justify-center gap-3 hover:border-blue-600 hover:text-blue-600 transition-all shadow-xl shadow-slate-200/50"
                  >
                    Latest Products
                  </Link>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <HiOutlineShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Certified</p>
                    <p className="text-sm font-black text-slate-900 leading-none">Enterprise Grade</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <HiOutlineStatusOnline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Availability</p>
                    <p className="text-sm font-black text-slate-900 leading-none">Global Shipping</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image/Illustration Right */}
          <div className="relative mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Glass Card Container */}
              <div className="relative p-4 md:p-8 bg-white/40 backdrop-blur-3xl rounded-[40px] md:rounded-[60px] border border-white/50 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.08)] max-w-[400px] lg:max-w-none mx-auto">
                <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden aspect-square md:aspect-square bg-slate-100 shadow-inner group">
                  <motion.img 
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    src={generalImg} 
                    alt="Industrial Technology" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-transparent"></div>
                </div>

                {/* Floating Elements - Hidden or adjusted on small mobile */}
                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 md:-top-10 -right-4 md:-right-10 p-3 md:p-6 bg-white rounded-2xl md:rounded-[32px] shadow-2xl border border-slate-50 flex items-center gap-2 md:gap-4"
                >
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                    <HiOutlineCube size={24} className="md:size-[28px]" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</p>
                    <p className="text-sm md:text-lg font-black text-slate-900 leading-none">Elite Series</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-10 p-3 md:p-5 bg-slate-900 text-white rounded-2xl md:rounded-[32px] shadow-2xl flex items-center gap-2 md:gap-4"
                >
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</p>
                    <p className="text-xs md:text-sm font-bold">24/7 Ops</p>
                  </div>
                </motion.div>
              </div>

              {/* Background Shapes */}
              <div className="absolute -z-10 -bottom-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[80px]"></div>
              <div className="absolute -z-10 top-20 -left-20 w-64 h-64 bg-slate-200/50 rounded-full blur-[60px]"></div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
