import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { FiPackage, FiTruck, FiCheckCircle, FiSearch, FiAlertCircle, FiClock, FiMapPin } from 'react-icons/fi';

const TrackOrder = () => {
  const location = useLocation();
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  // Auto-track if ID is in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setTrackingId(id);
      performTrack(id);
    }
  }, [location]);

  const performTrack = async (queryId) => {
    if (!queryId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data } = await api.get(`/api/orders/track/${queryId.trim()}`);
      console.log('Tracking data received:', data);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your Tracking ID or Order ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    performTrack(trackingId);
  };

  const getStatusStep = (status) => {
    if (!status) return -1;
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status.toLowerCase());
  };

  const steps = [
    { name: 'Pending', icon: <FiClock />, label: 'Order Placed' },
    { name: 'Confirmed', icon: <FiCheckCircle />, label: 'Confirmed' },
    { name: 'Processing', icon: <FiPackage />, label: 'Processing' },
    { name: 'Shipped', icon: <FiTruck />, label: 'In Transit' },
    { name: 'Delivered', icon: <FiCheckCircle />, label: 'Delivered' }
  ];

  const currentStep = order ? getStatusStep(order.status) : -1;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 mb-4"
          >
            Track Your Order
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600"
          >
            Enter your Tracking ID or Order ID to see real-time status
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleTrack}
          className="relative mb-12"
        >
          <input
            type="text"
            placeholder="Enter Order ID or Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 focus:border-blue-500 focus:ring-0 transition-all text-lg font-medium"
          />
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-2xl" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-700"
            >
              <FiAlertCircle className="text-2xl shrink-0" />
              <p className="font-semibold">{error}</p>
            </motion.div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
                  <div>
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-1">Status Update</span>
                    <h2 className="text-3xl font-black text-slate-900">{order?.status || 'Unknown'}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-sm font-bold block">Tracking ID / Order ID</span>
                    <span className="text-slate-900 font-black">{order?.trackingId || order?.orderNumber || order?._id || 'N/A'}</span>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="relative pt-10 pb-4">
                  <div className="absolute top-10 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
                  <div 
                    className="absolute top-10 left-0 h-1 bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  ></div>
                  
                  <div className="relative flex justify-between mt-6">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${
                            idx <= currentStep 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                              : 'bg-white text-slate-300 border-2 border-slate-100'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className={`text-[8px] sm:text-[10px] md:text-xs font-black mt-3 uppercase tracking-tighter text-center w-12 sm:w-20 md:w-auto break-words ${
                          idx <= currentStep ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <FiPackage className="text-xl" />
                    </div>
                    <h3 className="font-black text-slate-900">Order Summary</h3>
                  </div>
                  <div className="space-y-4">
                    {order?.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-bold">x{item.quantity}</span>
                          <span className="text-slate-700 font-bold truncate max-w-[150px]">{item.name}</span>
                        </div>
                        <span className="text-slate-900 font-black">Rs {item?.price?.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-slate-400 font-black uppercase text-xs">Total Amount</span>
                      <span className="text-2xl font-black text-blue-600">Rs {order?.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                      <FiMapPin className="text-xl" />
                    </div>
                    <h3 className="font-black text-slate-900">Delivery Info</h3>
                  </div>
                  <div className="space-y-3">
                    {order?.shippingAddress ? (
                      <div className="space-y-2">
                        <p className="text-slate-900 font-black text-lg border-b border-slate-50 pb-2 mb-2">
                          {order.user?.name || order.guestInfo?.name || order.shippingAddress?.name || 'Customer'}
                        </p>
                        <p className="text-slate-600 font-bold leading-relaxed">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                        <div className="pt-4 border-t border-slate-50 mt-4">
                          <span className="text-slate-400 text-[10px] font-black uppercase block mb-1">Order Date & Time</span>
                          <span className="text-slate-900 font-bold text-sm">
                            {new Date(order.createdAt).toLocaleString('en-PK', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">Shipping information not available</p>
                    )}
                    <div className="pt-4">
                      <span className="text-slate-400 text-xs font-black uppercase block mb-1">Estimated Delivery</span>
                      <span className="text-slate-900 font-black">Within 3-5 Working Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support CTA */}
              <div className="text-center pt-8">
                <p className="text-slate-500 font-bold mb-4">Having issues with your tracking?</p>
                <a 
                  href="https://wa.me/923117702133" 
                  className="inline-flex items-center gap-2 text-blue-600 font-black hover:underline"
                >
                  Contact WhatsApp Support
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackOrder;
