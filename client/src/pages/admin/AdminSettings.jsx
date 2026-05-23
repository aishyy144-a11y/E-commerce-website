import React from 'react';
import { 
  HiOutlineCog, 
  HiOutlineShieldCheck, 
  HiOutlineBell, 
  HiOutlineMail,
  HiOutlineDatabase
} from 'react-icons/hi';

const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-500 font-medium">Configure your industrial e-commerce environment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Settings */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
              <HiOutlineShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">Security Protocol</h3>
          </div>
          
          <div className="space-y-6">
            <label className="flex items-center justify-between p-6 bg-gray-50 rounded-[24px] cursor-pointer group hover:bg-primary/5 transition-all">
              <div>
                <span className="block text-sm font-black text-gray-900 mb-1">Two-Factor Authentication</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Enforce 2FA for all admin accounts</span>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </label>
            <label className="flex items-center justify-between p-6 bg-gray-50 rounded-[24px] cursor-pointer group hover:bg-primary/5 transition-all">
              <div>
                <span className="block text-sm font-black text-gray-900 mb-1">Session Management</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Automatically logout inactive users</span>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Engine */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
              <HiOutlineBell size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">Notification Engine</h3>
          </div>
          
          <div className="space-y-6">
            <label className="flex items-center justify-between p-6 bg-gray-50 rounded-[24px] cursor-pointer group hover:bg-primary/5 transition-all">
              <div>
                <span className="block text-sm font-black text-gray-900 mb-1">Order Notifications</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Instant email alerts for new orders</span>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </label>
            <label className="flex items-center justify-between p-6 bg-gray-50 rounded-[24px] cursor-pointer group hover:bg-primary/5 transition-all">
              <div>
                <span className="block text-sm font-black text-gray-900 mb-1">Inquiry Alerts</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Notification for new quotation requests</span>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Database & Logistics */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
              <HiOutlineDatabase size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">System & Logistics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Alert Email</label>
              <div className="relative">
                <input readOnly value="innovativesolutions.support.pk@gmail.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-500" />
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">VAT Percentage (%)</label>
              <input readOnly value="15" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
