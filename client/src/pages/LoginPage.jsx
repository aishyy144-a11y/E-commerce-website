import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineLightBulb, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowRight } from 'react-icons/hi';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await login(formData.email, formData.password);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
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
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
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
            Access Your <span className="text-primary italic">Innovation</span> Hub
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
            Log in to manage your industrial projects, track technical orders, and get expert quotations for your enterprise needs.
          </p>
          <div className="flex gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex-1">
              <p className="text-2xl font-black text-primary">5000+</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Clients</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex-1">
              <p className="text-2xl font-black text-primary">24/7</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expert Support</p>
            </div>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
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

          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Please enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold group-hover:border-primary/20"
                  placeholder="Enter your email address"
                />
                <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" state={{ from }} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold group-hover:border-primary/20"
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
              className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-10"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <HiOutlineArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium text-sm">
              Don't have an account? <Link to="/register" state={{ from }} className="text-primary font-black hover:underline">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
