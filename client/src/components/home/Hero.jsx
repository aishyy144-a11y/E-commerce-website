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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Left */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                Next-Gen Industrial Solutions
              </span>
              
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
                Advanced <span className="text-blue-600">Equipment</span> & <br />
                <span className="relative inline-block">
                  Reliable Support
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="absolute bottom-2 left-0 h-3 bg-blue-100 -z-10"
                  ></motion.span>
                </span>
              </h1>
              
              <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
                Pioneering the future of industrial efficiency with elite drones, telecom infrastructure, 
                fiber optics, and enterprise surveillance systems tailored for professional excellence.
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/categories"
                    className="px-10 py-5 bg-blue-600 text-white rounded-[20px] font-black text-lg flex items-center gap-3 shadow-2xl shadow-blue-600/30 group transition-all"
                  >
                    Explore Categories
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/shop"
                    className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[20px] font-black text-lg flex items-center gap-3 hover:border-blue-600 hover:text-blue-600 transition-all shadow-xl shadow-slate-200/50"
                  >
                    Latest Products
                  </Link>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-wrap items-center gap-10">
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
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Glass Card Container */}
              <div className="relative p-8 bg-white/40 backdrop-blur-3xl rounded-[60px] border border-white/50 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.08)]">
                <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] lg:aspect-square bg-slate-100 shadow-inner group">
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

                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 p-6 bg-white rounded-[32px] shadow-2xl border border-slate-50 flex items-center gap-4"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                    <HiOutlineCube size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</p>
                    <p className="text-lg font-black text-slate-900">Elite Series 7</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-10 p-5 bg-slate-900 text-white rounded-[32px] shadow-2xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</p>
                    <p className="text-sm font-bold">24/7 Technical Ops</p>
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
