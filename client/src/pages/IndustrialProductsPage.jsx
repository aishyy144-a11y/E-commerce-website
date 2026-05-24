import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import { 
  HiOutlineFilter, 
  HiOutlineSearch, 
  HiOutlineShoppingBag, 
  HiOutlineEye,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineMail
} from 'react-icons/hi';

import AdvancedFilterSidebar from '../components/products/AdvancedFilterSidebar';
import QuotationForm from '../components/products/QuotationForm';
import ProductCard from '../components/products/ProductCard';

const EmptyState = ({ onReset }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100"
  >
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <HiOutlineSearch size={40} className="text-gray-300" />
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-2">No results found</h3>
    <p className="text-gray-500 font-medium">Try adjusting your filters or search terms to find what you're looking for.</p>
    <button 
      onClick={onReset}
      className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
    >
      Clear All Filters
    </button>
  </motion.div>
);

const IndustrialProductsPage = () => {
  const { addToCart } = useCart();
  const location = useLocation();
  
  // Use React Query for fetching
  const { data: shopData, isLoading } = useQuery({
    queryKey: ['shop-data'],
    queryFn: async () => {
      const [prodRes, catRes] = await Promise.all([
        api.get('/api/products/all'),
        api.get('/api/categories')
      ]);
      return { products: prodRes.data, categories: catRes.data };
    }
  });

  const products = shopData?.products || [];
  const categories = shopData?.categories || [];

  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filters State
  const initialFilters = {
    searchTerm: '',
    selectedCategories: []
  };
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('newest');

  // Handle URL Search Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, searchTerm: searchQuery }));
    }
  }, [location.search]);
  
  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      let result = products.filter(p => {
        const searchTermLower = filters.searchTerm.toLowerCase();
        
        const matchesSearch = p.name.toLowerCase().includes(searchTermLower) || 
                              p.modelNumber?.toLowerCase().includes(searchTermLower) ||
                              p.description.toLowerCase().includes(searchTermLower) ||
                              p.category?.name.toLowerCase().includes(searchTermLower);
        
        const matchesCategory = filters.selectedCategories.length === 0 || filters.selectedCategories.includes(p.category.name);
        
        return matchesSearch && matchesCategory;
      });

      // Apply Sorting
      if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
      else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
      else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFilteredProducts(result);
    }
  }, [filters, sortBy, products]);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const catName = product.category?.name || 'Uncategorized';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const handleReset = () => setFilters(initialFilters);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-4 md:pt-6">
      {/* Page Header */}
      <div className="bg-primary py-8 md:py-12 text-white relative overflow-hidden rounded-[32px] mx-4 sm:mx-6 lg:mx-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            {filters.selectedCategories.length === 1 
              ? filters.selectedCategories[0] 
              : filters.selectedCategories.length > 1 
                ? 'Multiple Categories' 
                : 'Industrial & Telecom Solutions'}
          </h1>
          <p className="text-primary-light text-lg max-w-2xl opacity-90 font-medium">
            {filters.selectedCategories.length === 1 
              ? `Exploring our premium selection of ${filters.selectedCategories[0]} and technical equipment.`
              : 'Enterprise-grade equipment and specialized components for professional infrastructure and surveillance.'}
          </p>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Advanced Filters Sidebar */}
          <div className="lg:w-1/4">
            <AdvancedFilterSidebar 
              products={products}
              categories={categories}
              filters={filters}
              setFilters={setFilters}
              onReset={handleReset}
            />
          </div>

          {/* Product Grid Area */}
          <main className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <div>
                <span className="text-sm font-bold text-gray-500">
                  Showing <span className="text-primary">{filteredProducts.length}</span> technical items
                </span>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-600 focus:outline-none focus:border-primary cursor-pointer transition-all uppercase tracking-widest"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                    <HiOutlineFilter size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  Object.entries(groupedProducts).map(([categoryName, products], catIndex) => (
                    <motion.div 
                      key={categoryName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.1 }}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{categoryName}</h2>
                        <div className="flex-grow h-px bg-gray-200"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} Items</span>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                        {products.map((product, index) => (
                          <ProductCard 
                            key={product._id} 
                            product={product} 
                            index={index} 
                            category={product.category} 
                            addToCart={addToCart} 
                            onRequestQuote={setSelectedQuoteProduct}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <EmptyState onReset={handleReset} />
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-400 rounded-full hover:bg-primary hover:text-white transition-all z-20"
              >
                <HiOutlineX size={24} />
              </button>

              <div className="md:w-1/2 h-[400px] md:h-auto bg-gray-50">
                <img 
                  src={quickViewProduct.images[0]} 
                  className="w-full h-full object-cover" 
                  alt={quickViewProduct.name} 
                  crossOrigin="anonymous"
                />
              </div>

              <div className="md:w-1/2 p-10 md:p-16 flex flex-col">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 bg-primary-light text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    {quickViewProduct.brand} Professional
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{quickViewProduct.name}</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Part No: {quickViewProduct.modelNumber}</p>
                </div>

                <div className="text-3xl font-black text-primary mb-8">
                  Rs {quickViewProduct.price.toLocaleString()}
                </div>

                <div className="space-y-6 flex-grow">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{quickViewProduct.description}</p>
                  </div>
                  
                  {quickViewProduct.specifications && (
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Technical Specs</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(quickViewProduct.specifications).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="block text-[10px] text-gray-400 font-bold uppercase">{key}</span>
                            <span className="text-xs font-bold text-gray-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="px-6 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl hover:border-primary hover:text-primary transition-all"
                  >
                    <HiOutlineShoppingBag size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndustrialProductsPage;
