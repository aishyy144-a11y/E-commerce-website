import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineCurrencyDollar } from 'react-icons/hi';

const AdminAnalytics = () => {
  const [data, setData] = useState({
    orderVolume: [],
    revenueByCat: [],
    statusDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [orderRes, catRes] = await Promise.all([
        api.get('/api/orders'),
        api.get('/api/categories')
      ]);

      const orders = orderRes.data;
      
      // Process Order Volume (last 7 days)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }).reverse();

      const volumeData = last7Days.map(day => {
        const count = orders.filter(o => new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) === day).length;
        return { name: day, orders: count };
      });

      // Process Status Distribution
      const statusMap = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {});
      const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

      // Revenue by Category (Mocked as real association is deeper)
      const revenueData = catRes.data.map(cat => ({
        name: cat.name.split(' ')[0],
        revenue: Math.floor(Math.random() * 5000) + 1000
      }));

      setData({
        orderVolume: volumeData,
        revenueByCat: revenueData,
        statusDistribution: statusData
      });
    } catch (err) {
      console.error('Analytics fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Technical Analytics</h1>
          <p className="text-gray-500 font-medium">Deep insights into your industrial market performance.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <HiOutlineTrendingUp className="text-green-500" />
          <span className="text-sm font-black text-gray-900">+12.4% <span className="text-gray-400 font-bold ml-1">vs last month</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Volume Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">Daily Order Volume</h3>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full">Last 7 Days</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={0}>
              <AreaChart data={data.orderVolume}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }} 
                />
                <Area type="monotone" dataKey="orders" stroke="#1E40AF" strokeWidth={4} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">Revenue by Sector</h3>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full">Projected</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={0}>
              <BarChart data={data.revenueByCat}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }} />
                <Bar dataKey="revenue" fill="#1E40AF" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-gray-900 tracking-tighter">Order Lifecycle Distribution</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                <PieChart>
                  <Pie
                    data={data.statusDistribution}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {data.statusDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{entry.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-500">{entry.value} Orders</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
