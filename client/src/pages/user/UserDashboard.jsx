import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  HiOutlineClock
} from 'react-icons/hi';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await api.get('/api/orders/myorders');
        setRecentOrders(response.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRecentOrders();
  }, [user]);

  const stats = [
    { label: 'Total Orders', value: recentOrders.length, icon: <HiOutlineShoppingBag size={24} />, color: 'bg-blue-500' },
    { label: 'Pending Quotes', value: '2', icon: <HiOutlineCube size={24} />, color: 'bg-amber-500' },
    { label: 'Active Support', value: '1', icon: <HiOutlineUser size={24} />, color: 'bg-emerald-500' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <HiOutlineCheckCircle className="text-emerald-500" />;
      case 'Shipped': return <HiOutlineTruck className="text-indigo-500" />;
      default: return <HiOutlineClock className="text-amber-500" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">User Dashboard</h1>
          <p className="text-gray-500 font-medium text-lg">Welcome back, <span className="text-primary font-bold">{user?.name}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation - Responsive Horizontally Scrollable on Mobile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[24px] lg:rounded-[32px] p-2 lg:p-4 shadow-sm border border-gray-100 flex lg:flex-col gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link to="/dashboard" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 bg-primary text-white rounded-xl lg:rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary/20 flex-shrink-0">
                <HiOutlineViewGrid size={20} /> Overview
              </Link>
              <Link to="/orders" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-xl lg:rounded-2xl font-black text-sm transition-all flex-shrink-0">
                <HiOutlineShoppingBag size={20} /> My Orders
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-xl lg:rounded-2xl font-black text-sm transition-all flex-shrink-0">
                <HiOutlineUser size={20} /> My Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-xl lg:rounded-2xl font-black text-sm transition-all flex-shrink-0">
                <HiOutlineCog size={20} /> Settings
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6"
                >
                  <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gray-200`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900 leading-none tracking-tighter">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Recent Orders</h3>
                <Link to="/orders" className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                  View All Orders <HiOutlineArrowRight />
                </Link>
              </div>
              <div className="p-8">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-6">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="hidden md:block text-right">
                            <p className="text-sm font-black text-gray-900">Rs {order.totalPrice.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.orderItems.length} Items</p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <HiOutlineShoppingBag size={48} className="text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="text-primary font-black uppercase text-xs tracking-widest mt-4 inline-block hover:underline">Start Shopping</Link>
                  </div>
                )}
              </div>
            </div>
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

export default UserDashboard;
