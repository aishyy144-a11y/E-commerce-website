import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineCalendar,
  HiOutlineBadgeCheck,
  HiOutlineShoppingBag,
  HiOutlineCog,
  HiOutlineArrowRight,
  HiOutlineViewGrid
} from 'react-icons/hi';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">My Profile</h1>
          <p className="text-gray-500 font-medium">Manage your personal industrial account information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 overflow-hidden">
              <Link to="/dashboard" className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl font-black text-sm transition-all mt-2">
                <HiOutlineViewGrid size={20} /> Overview
              </Link>
              <Link to="/orders" className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl font-black text-sm transition-all mt-2">
                <HiOutlineShoppingBag size={20} /> My Orders
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary/20">
                <HiOutlineUser size={20} /> My Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl font-black text-sm transition-all mt-2">
                <HiOutlineCog size={20} /> Settings
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-32 bg-primary relative">
                <div className="absolute -bottom-12 left-12 w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white">
                  <HiOutlineUser size={48} className="text-primary" />
                </div>
              </div>
              <div className="pt-20 p-12 space-y-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">{user?.name}</h2>
                  <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em]">
                    <HiOutlineBadgeCheck size={14} /> Verified Enterprise Account
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Account Details</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <HiOutlineMail className="text-gray-400" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                          <p className="text-sm font-bold text-gray-900">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <HiOutlineCalendar className="text-gray-400" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Member Since</p>
                          <p className="text-sm font-bold text-gray-900">May 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Quick Actions</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Link to="/orders" className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <HiOutlineShoppingBag className="text-gray-400 group-hover:text-primary" size={20} />
                          <span className="text-sm font-bold text-gray-700">View Recent Orders</span>
                        </div>
                        <HiOutlineArrowRight className="text-gray-300 group-hover:text-primary transition-all" />
                      </Link>
                      <Link to="/settings" className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <HiOutlineCog className="text-gray-400 group-hover:text-primary" size={20} />
                          <span className="text-sm font-bold text-gray-700">Account Settings</span>
                        </div>
                        <HiOutlineArrowRight className="text-gray-300 group-hover:text-primary transition-all" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
