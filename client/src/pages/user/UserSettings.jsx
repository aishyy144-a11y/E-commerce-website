import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineShoppingBag,
  HiOutlineCog,
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineShieldCheck
} from 'react-icons/hi';

const UserSettings = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Settings</h1>
          <p className="text-gray-500 font-medium">Customize your account preferences and security.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation - Responsive Horizontally Scrollable on Mobile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[24px] lg:rounded-[32px] p-2 lg:p-4 shadow-sm border border-gray-100 flex lg:flex-col gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link to="/dashboard" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-xl lg:rounded-2xl font-black text-sm transition-all flex-shrink-0">
                <HiOutlineViewGrid size={20} /> Overview
              </Link>
              <Link to="/orders" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-xl lg:rounded-2xl font-black text-sm transition-all flex-shrink-0">
                <HiOutlineShoppingBag size={20} /> My Orders
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 text-gray-500 hover:text-primary hover:bg-primary-light rounded-xl lg:rounded-2xl font-black text-sm transition-all flex-shrink-0">
                <HiOutlineUser size={20} /> My Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4 bg-primary text-white rounded-xl lg:rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary/20 flex-shrink-0">
                <HiOutlineCog size={20} /> Settings
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden p-10">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                <HiOutlineLockClosed className="text-primary" /> Security & Privacy
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <HiOutlineShieldCheck className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Disabled</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Enable</button>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <HiOutlineBell className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">Email Notifications</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Important Updates Only</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Configure</button>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-100">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8">Danger Zone</h3>
                <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center justify-between">
                  <div>
                    <p className="font-black text-red-600 text-sm">Deactivate Account</p>
                    <p className="text-xs text-red-400 font-bold uppercase tracking-tighter">This action cannot be undone.</p>
                  </div>
                  <button className="px-6 py-2 bg-white border border-red-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all">Deactivate</button>
                </div>
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

export default UserSettings;
