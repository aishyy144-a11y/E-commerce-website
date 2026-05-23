import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineShoppingBag, 
  HiOutlineHeart, 
  HiOutlineUser, 
  HiOutlineSearch, 
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineCube,
  HiOutlineCollection,
  HiOutlineLightBulb
} from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import SearchModal from './SearchModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount, wishlist } = useCart();
  const { user, isAdmin, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      logout();
    }, 10);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          isScrolled 
            ? 'py-4 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                <HiOutlineLightBulb className="text-white text-3xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900 tracking-tighter leading-none uppercase">Innovative</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Solutions</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-10">
              {navLinks.map((link) => (
                <div 
                  key={link.name}
                  className="relative py-2"
                >
                  <Link 
                    to={link.path}
                    className={`text-sm font-black uppercase tracking-widest transition-colors flex items-center gap-1 ${
                      location.pathname === link.path ? 'text-primary' : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-3 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl transition-all group"
              >
                <HiOutlineSearch size={24} className="group-hover:scale-110 transition-transform" />
              </button>

              {/* Wishlist */}
              {user && (
                <Link to="/wishlist" className="hidden sm:flex p-3 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl transition-all relative group">
                  <HiOutlineHeart size={24} className="group-hover:scale-110 transition-transform" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-lg"></span>
                  )}
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="p-3 text-gray-500 hover:text-primary hover:bg-primary-light rounded-2xl transition-all relative group">
                <HiOutlineShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
                <AnimatePresence>
                  {getCartCount() > 0 && (
                    <motion.span 
                      key={getCartCount()}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg"
                    >
                      {getCartCount()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* User Profile */}
              <div className="relative group/user py-2">
                <button 
                  onClick={() => !user && navigate('/login', { state: { from: location.pathname } })}
                  className="flex items-center gap-3 p-1.5 md:pl-1.5 md:pr-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-gray-100">
                    <HiOutlineUser size={20} />
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      {user ? 'Authenticated' : 'Welcome'}
                    </span>
                    <span className="text-xs font-black text-gray-900 leading-none">
                      {user ? user.name.split(' ')[0] : 'Sign In'}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {user && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible translate-y-4 group-hover/user:translate-y-0 transition-all duration-300 overflow-hidden z-[70]">
                    <div className="p-6 bg-gray-50 border-b border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logged in as</p>
                      <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-primary-light hover:text-primary rounded-xl transition-all">
                          <HiOutlineCollection size={18} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-primary-light hover:text-primary rounded-xl transition-all">
                        <HiOutlineUser size={18} /> User Panel
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <HiOutlineLogout size={18} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-3 text-gray-900 bg-gray-50 rounded-2xl"
              >
                {isMobileMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[70] xl:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[80] xl:hidden shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-black text-gray-900 tracking-tighter">NAVIGATION</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-xl">
                  <HiOutlineX size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path}
                    className="block text-2xl font-black text-gray-900 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-8 border-t border-gray-100">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="w-full py-4 bg-gray-50 text-gray-900 font-black rounded-2xl flex items-center justify-center gap-3 mb-4"
                >
                  <HiOutlineSearch size={20} /> Search Store
                </button>
                {!user && (
                  <Link 
                    to="/login" 
                    state={{ from: location.pathname }}
                    className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                  >
                    Sign In <HiOutlineUser size={20} />
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
