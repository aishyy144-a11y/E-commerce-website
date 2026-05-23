import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowLeft } from 'react-icons/hi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = password.length >= 6;
  const isMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      return toast.error('Password must be at least 6 characters');
    }
    if (!isMatch) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.post(`/api/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-[32px] sm:px-10 border border-gray-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <HiOutlineLockClosed size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Set New Password</h2>
            <p className="mt-2 text-sm text-gray-500 font-bold">Please enter a strong password that you'll remember.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                  placeholder="••••••••"
                />
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                  placeholder="••••••••"
                />
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
              <HiOutlineArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
