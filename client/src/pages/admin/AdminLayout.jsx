import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  HiOutlineViewGrid, 
  HiOutlineCube, 
  HiOutlinePlusCircle, 
  HiOutlineCloudUpload,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChartBar,
  HiOutlineChatAlt,
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineLightBulb,
  HiOutlineMailOpen,
  HiOutlineMenuAlt3,
  HiOutlineX
} from 'react-icons/hi';

const SiteLogo = ({ size = 'md' }) => (
  <div className={`${size === 'sm' ? 'w-10 h-10' : 'w-10 h-10'} bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0`}>
    <HiOutlineLightBulb className="text-white text-xl" />
  </div>
);

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = () => api.get('/api/categories').then((r) => r.data);
    queryClient.prefetchQuery({ queryKey: ['categories'], queryFn: fetchCategories });
    queryClient.prefetchQuery({ queryKey: ['admin-categories'], queryFn: fetchCategories });
    queryClient.prefetchQuery({
      queryKey: ['admin-products'],
      queryFn: () => api.get('/api/products/all?fields=card').then((r) => r.data),
    });
    queryClient.prefetchQuery({
      queryKey: ['admin-orders'],
      queryFn: () => api.get('/api/orders').then((r) => r.data),
    });
    queryClient.prefetchQuery({
      queryKey: ['admin-inquiries'],
      queryFn: () => api.get('/api/inquiries').then((r) => r.data),
    });
  }, [queryClient]);

  const handleLogout = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      logout();
    }, 10);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <HiOutlineViewGrid size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <HiOutlineChartBar size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <HiOutlineCube size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <HiOutlineTag size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <HiOutlineShoppingBag size={20} /> },
    { name: 'Quotations', path: '/admin/quotations', icon: <HiOutlineChatAlt size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <HiOutlineUsers size={20} /> },
    { name: 'Newsletter', path: '/admin/newsletter', icon: <HiOutlineMailOpen size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <HiOutlineCog size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[70] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white z-[80] md:hidden shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                <Link to="/" className="text-2xl font-black text-primary flex items-center gap-2" onClick={() => setIsMobileSidebarOpen(false)}>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <HiOutlineLightBulb className="text-white text-xl" />
                  </div>
                  <span className="uppercase tracking-tighter text-lg">Admin<span className="text-gray-400">Panel</span></span>
                </Link>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <HiOutlineX size={20} />
                </button>
              </div>

              <nav className="flex-grow space-y-1 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      location.pathname === item.path 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-gray-100 bg-white">
                <button 
                  onClick={() => { setIsMobileSidebarOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                  <HiOutlineLogout size={20} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="text-2xl font-black text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <HiOutlineLightBulb className="text-white text-xl" />
            </div>
            <span className="uppercase tracking-tighter text-lg">Admin<span className="text-gray-400">Panel</span></span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-white">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <HiOutlineLogout size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 py-4 px-4 md:px-8 sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-primary rounded-xl md:hidden hover:bg-gray-50 transition-colors"
            >
              <HiOutlineMenuAlt3 size={24} />
            </button>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Control Panel</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 leading-none">System Admin</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Access</p>
              </div>
              <SiteLogo />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
