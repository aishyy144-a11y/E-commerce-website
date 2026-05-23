import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
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
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  <HiOutlineMail size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Forgot Password?</h2>
                <p className="mt-2 text-sm text-gray-500 font-bold">Enter your email and we'll send you a link to reset your password.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                      placeholder="e.g. user@example.com"
                    />
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {loading ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                <HiOutlineCheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Check Your Email</h2>
              <p className="mt-2 text-sm text-gray-500 font-bold">We've sent a password reset link to <span className="text-primary">{email}</span></p>
              <p className="mt-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">Didn't receive it? Check your spam folder.</p>
            </div>
          )}

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

export default ForgotPassword;
