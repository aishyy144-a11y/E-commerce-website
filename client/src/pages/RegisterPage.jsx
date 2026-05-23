import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineArrowRight, HiOutlineLightBulb, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register(formData.name, formData.email, formData.password);
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Illustration/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000" 
            alt="Technical Background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-lg"
        >
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-10">
            <HiOutlineLightBulb className="text-white text-5xl" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tighter uppercase">
            Join the <span className="text-primary italic">Innovation</span> Network
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
            Create an account to unlock enterprise features, exclusive industrial pricing, and streamlined technical support for your business.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl font-black text-primary">Fast</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quotations</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl font-black text-primary">Priority</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fulfillment</p>
            </div>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white overflow-y-auto scrollbar-hide">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="lg:hidden text-center mb-12">
            <Link to="/" className="text-3xl font-black text-primary flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <HiOutlineLightBulb className="text-white text-2xl" />
              </div>
              <span className="uppercase tracking-tighter">Innovative<span className="text-gray-400">Solutions</span></span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Join 5000+ enterprise clients today.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Full Name</label>
              <div className="relative group">
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold group-hover:border-primary/20"
                  placeholder="Enter your full name"
                />
                <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold group-hover:border-primary/20"
                  placeholder="Enter your email address"
                />
                <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold group-hover:border-primary/20"
                  placeholder="Enter your password"
                />
                <HiOutlineLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account <HiOutlineArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium text-sm">
              Already have an account? <Link to="/login" state={{ from }} className="text-primary font-black hover:underline">Sign In Instead</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
