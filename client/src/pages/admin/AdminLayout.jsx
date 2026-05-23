import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  HiOutlineMailOpen
} from 'react-icons/hi';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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
      {/* Sidebar */}
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
        <header className="bg-white border-b border-gray-200 py-4 px-8 sticky top-0 z-20 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Control Panel</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 leading-none">System Admin</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Access</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200"></div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
