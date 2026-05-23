import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  HiOutlineCube, 
  HiOutlineTag, 
  HiOutlineUsers, 
  HiOutlineTrendingUp 
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    inventoryValue: 0,
    lowStock: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products/all'),
          axios.get('http://localhost:5000/api/categories')
        ]);
        
        const products = prodRes.data;
        setStats({
          products: products.length,
          categories: catRes.data.length,
          inventoryValue: products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0),
          lowStock: products.filter(p => p.stock < 10).length
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: <HiOutlineCube size={24} />, color: 'bg-blue-500' },
    { name: 'Categories', value: stats.categories, icon: <HiOutlineTag size={24} />, color: 'bg-indigo-500' },
    { name: 'Inventory Value', value: `Rs ${stats.inventoryValue.toLocaleString()}`, icon: <HiOutlineTrendingUp size={24} />, color: 'bg-green-500' },
    { name: 'Low Stock Items', value: stats.lowStock, icon: <HiOutlineUsers size={24} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 font-medium">Real-time statistics for your industrial inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4 overflow-hidden"
          >
            <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg flex-shrink-0`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate">{card.name}</p>
              <h3 className="text-xl font-black text-gray-900 break-all leading-tight">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">P</div>
              <div>
                <p className="text-sm font-bold text-gray-900">New Product Added</p>
                <p className="text-xs text-gray-500">DJI Matrice 300 RTK - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">I</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Inventory Update</p>
                <p className="text-xs text-gray-500">Thermal Camera stock updated - 5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden">
          <h3 className="text-2xl font-black mb-4 relative z-10">System Health</h3>
          <p className="text-primary-light mb-8 opacity-80 relative z-10">All systems operational. MongoDB Atlas connection latency: 45ms.</p>
          <div className="flex gap-4 relative z-10">
            <button className="px-6 py-3 bg-white text-primary font-black rounded-xl hover:bg-accent hover:text-white transition-all">
              Run Diagnostics
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
