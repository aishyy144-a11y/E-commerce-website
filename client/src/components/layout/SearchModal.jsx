import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineArrowRight, 
  HiOutlineClock, 
  HiOutlineFire,
  HiOutlineCube
} from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import axios from 'axios';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = sessionStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      setLoading(true);
      const timer = setTimeout(async () => {
        try {
          const response = await api.get(`/api/products/search?query=${query}`);
          setResults(response.data);
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    sessionStorage.setItem('recentSearches', JSON.stringify(updated));
    
    // If it's a direct product match from suggestions, navigate to it
    // Otherwise, we could navigate to a search results page
    // For now, let's just close and navigate to shop with search
    setQuery('');
    onClose();
    navigate(`/shop?search=${searchQuery}`);
  };

  const handleProductClick = (slug) => {
    onClose();
    setQuery('');
    navigate(`/product/${slug}`);
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    if (location.pathname === '/shop' && location.search.includes('search=')) {
      navigate('/shop');
    }
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    sessionStorage.removeItem('recentSearches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="px-6 py-8 md:px-12 border-b border-gray-100"
          >
            <div className="max-w-5xl mx-auto flex items-center gap-6">
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-primary" size={28} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder="Enter model, brand, or category..."
                  className="w-full pl-12 pr-4 py-4 text-2xl md:text-4xl font-black text-gray-900 placeholder:text-gray-200 focus:outline-none bg-transparent"
                />
              </div>
              <button 
                onClick={handleClose}
                className="p-3 bg-gray-100 text-gray-400 rounded-2xl hover:bg-primary hover:text-white transition-all group"
              >
                <HiOutlineX size={32} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>

          {/* Body */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto px-6 py-12 md:px-12 bg-gray-50/50"
          >
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
              
              {/* Left Column: Recent & Trends */}
              <div className="space-y-12">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <HiOutlineClock size={16} />
                        Recent Searches
                      </h3>
                      <button onClick={clearRecent} className="text-[10px] font-bold text-primary uppercase hover:underline">Clear</button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((s) => (
                        <button 
                          key={s}
                          onClick={() => setQuery(s)}
                          className="w-full text-left px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center justify-between group"
                        >
                          {s}
                          <HiOutlineArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <HiOutlineFire size={16} className="text-orange-500" />
                    Popular Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.length > 0 ? (
                      categories.slice(0, 6).map(cat => (
                        <button 
                          key={cat._id}
                          onClick={() => setQuery(cat.name)}
                          className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-black text-gray-900 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                          {cat.name}
                        </button>
                      ))
                    ) : (
                      ['Drones', 'Radio Systems', 'Camera', 'Networking', 'Telecom'].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setQuery(cat)}
                          className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-black text-gray-900 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                          {cat}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-2">
                {query.length > 1 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        {loading ? 'Searching...' : `Found ${results.length} results`}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {loading ? (
                        // Loading Skeletons
                        [...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-[24px] border border-gray-100 animate-pulse">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        results.map((product) => (
                          <motion.button
                            layout
                            key={product._id}
                            onClick={() => handleProductClick(product.slug)}
                            className="flex items-center gap-4 p-4 bg-white rounded-[24px] border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all text-left group"
                          >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{product.brand}</span>
                                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                <span className="text-[10px] font-black text-primary uppercase">{product.modelNumber}</span>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>

                    {results.length === 0 && !loading && (
                      <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <HiOutlineCube size={40} className="text-gray-300" />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">No items found</h4>
                        <p className="text-gray-500 font-medium">Try searching for a different model or category.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                    <HiOutlineSearch size={80} className="text-gray-200 mb-6" />
                    <h3 className="text-2xl font-black text-gray-300">Start typing to search...</h3>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
