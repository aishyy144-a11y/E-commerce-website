import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineShoppingBag, 
  HiOutlineCube, 
  HiOutlineUser, 
  HiOutlineCog,
  HiOutlineArrowRight,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineLocationMarker
} from 'react-icons/hi';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders/myorders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getStepStatus = (orderStatus, step) => {
    const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(step);
    
    if (orderStatus === 'Cancelled') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">My Orders</h1>
          <p className="text-gray-500 font-medium">Track and manage your industrial equipment orders.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 overflow-hidden">
              <Link to="/dashboard" className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl font-black text-sm transition-all mt-2">
                <HiOutlineViewGrid size={20} /> Overview
              </Link>
              <Link to="/orders" className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary/20">
                <HiOutlineShoppingBag size={20} /> My Orders
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl font-black text-sm transition-all mt-2">
                <HiOutlineUser size={20} /> My Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl font-black text-sm transition-all mt-2">
                <HiOutlineCog size={20} /> Settings
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="bg-white rounded-[40px] p-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div 
                    key={order._id}
                    layout
                    className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100">
                          <HiOutlineCube size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                        <button 
                          onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                          className="px-6 py-2 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-gray-200"
                        >
                          {selectedOrder?._id === order._id ? 'Hide Details' : 'Track Order'}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedOrder?._id === order._id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-8 bg-gray-50/50 space-y-12">
                            {/* Tracking Progress */}
                            <div className="relative pt-10 pb-4">
                              <div className="absolute top-10 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                              <div className="flex justify-between relative">
                                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                  const status = getStepStatus(order.status, step);
                                  return (
                                    <div key={idx} className="flex flex-col items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full border-4 z-10 flex items-center justify-center transition-all ${
                                        status === 'completed' ? 'bg-primary border-primary-light text-white' :
                                        status === 'current' ? 'bg-white border-primary text-primary animate-pulse' :
                                        'bg-white border-gray-200 text-gray-300'
                                      }`}>
                                        {status === 'completed' ? <HiOutlineCheckCircle size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                      </div>
                                      <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                        status === 'completed' || status === 'current' ? 'text-gray-900' : 'text-gray-400'
                                      }`}>{step}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Order Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              {/* Left: Items */}
                              <div className="space-y-6">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Items Ordered</h4>
                                <div className="space-y-4">
                                  {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-50">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-black text-gray-900">{item.name}</p>
                                        <p className="text-xs font-bold text-gray-400">{item.quantity} x Rs {item.price.toLocaleString()}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right: Logistics */}
                              <div className="space-y-8">
                                <div className="space-y-4">
                                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Address</h4>
                                  <div className="p-6 bg-white rounded-[24px] border border-gray-100 space-y-4">
                                    <div className="flex items-start gap-3">
                                      <HiOutlineLocationMarker className="text-primary mt-1" size={20} />
                                      <p className="text-sm font-bold text-gray-700 leading-relaxed">
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                        {order.shippingAddress.country}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Summary</h4>
                                  <div className="p-6 bg-primary text-white rounded-[24px] shadow-xl shadow-primary/20 space-y-3">
                                    <div className="flex justify-between text-xs font-bold opacity-80">
                                      <span>Subtotal</span>
                                      <span>Rs {order.itemsPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold opacity-80">
                                      <span>Tax & Logistics</span>
                                      <span>Rs {order.taxPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                      <span className="text-sm font-black uppercase tracking-widest">Total Paid</span>
                                      <span className="text-2xl font-black">Rs {order.totalPrice.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                <HiOutlineShoppingBag size={48} className="text-gray-100 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">You haven't placed any orders yet.</p>
                <Link to="/shop" className="text-primary font-black uppercase text-xs tracking-widest mt-4 inline-block hover:underline">Start Shopping</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HiOutlineViewGrid = ({ size }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

export default UserOrders;
