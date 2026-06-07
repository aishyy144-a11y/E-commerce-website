import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import DroneProductSpecs from '../components/home/DroneProductSpecs';
import LMRProductSpecs from '../components/home/LMRProductSpecs';
import CameraProductSpecs from '../components/home/CameraProductSpecs';
import TelephoneProductSpecs from '../components/home/TelephoneProductSpecs';
import MiscProductSpecs from '../components/home/MiscProductSpecs';
import { 
  HiOutlineSortAscending, 
  HiOutlineShoppingBag,
  HiOutlineChevronRight,
  HiOutlineCollection,
  HiOutlineArrowLeft
} from 'react-icons/hi';

import QuotationForm from '../components/products/QuotationForm';
import ProductCard from '../components/products/ProductCard';

import { ProductCardSkeleton } from '../components/common/Skeleton';

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100"
  >
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <HiOutlineCollection size={40} className="text-gray-300" />
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-2">No products in this category</h3>
    <p className="text-gray-500 font-medium">Please check back later for new arrivals.</p>
  </motion.div>
);

const CategoryProductsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const initialFilters = {
    searchTerm: '',
    selectedBrands: [],
    selectedCategories: [],
    priceRange: 5000000,
    inStockOnly: false,
    selectedSpecs: {},
    selectedCompatibility: []
  };
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/api/categories');
      return response.data;
    },
  });

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['category-products', slug],
    queryFn: async () => {
      const response = await api.get(`/api/products/category/${slug}`);
      return response.data;
    },
  });

  const category = useMemo(
    () => categories.find((c) => c.slug === slug) || null,
    [categories, slug]
  );

  useEffect(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            p.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesPrice = p.price <= filters.priceRange;
      const matchesStock = !filters.inStockOnly || p.stock > 0;
      
      const matchesBrand = filters.selectedBrands.length === 0 || filters.selectedBrands.includes(p.brand);

      // Technical Specs Filter
      const matchesSpecs = Object.entries(filters.selectedSpecs).every(([key, values]) => {
        if (!values || values.length === 0) return true;
        return values.includes(p.specifications?.[key]);
      });

      // Compatibility Filter
      const matchesCompatibility = filters.selectedCompatibility.length === 0 || 
        filters.selectedCompatibility.some(c => p.specifications?.Compatibility?.toLowerCase().includes(c.toLowerCase()));

      return matchesSearch && matchesPrice && matchesStock && matchesSpecs && matchesCompatibility && matchesBrand;
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredProducts(result);
  }, [filters, sortBy, products]);

  const handleReset = () => setFilters(initialFilters);

  // Group products by subCategory for miscellaneous category
  const groupedProducts = category?.slug === 'miscellaneous' 
    ? filteredProducts.reduce((acc, product) => {
        const sub = product.subCategory || 'Other';
        if (!acc[sub]) acc[sub] = [];
        acc[sub].push(product);
        return acc;
      }, {})
    : null;

  if (loading) return (
    <div className="bg-gray-50 min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-20">
      {/* Breadcrumbs & Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <HiOutlineChevronRight />
              <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
              <HiOutlineChevronRight />
              <span className="text-primary font-bold">{category?.name || slug}</span>
            </nav>

            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-gray-100"
            >
              <HiOutlineArrowLeft size={16} />
              Back
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{category?.name || 'Inventory'}</h1>
              <p className="text-gray-500 font-medium">Showing {filteredProducts.length} high-grade technical products</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 focus:outline-none focus:border-primary cursor-pointer transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <HiOutlineSortAscending className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          {/* Product Grid */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                category?.slug === 'miscellaneous' ? (
                  <div className="space-y-16">
                    {Object.entries(groupedProducts).map(([subCat, items], groupIdx) => (
                      <motion.div 
                        key={subCat}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIdx * 0.1 }}
                      >
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <HiOutlineCollection size={24} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-gray-900">{subCat}</h2>
                            <p className="text-sm font-medium text-gray-500">{items.length} professional components</p>
                          </div>
                          <div className="flex-grow h-px bg-gray-100 ml-4"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                          {items.map((product, index) => (
                            <ProductCard 
                              key={product._id} 
                              product={product} 
                              index={index} 
                              category={category} 
                              addToCart={addToCart} 
                              onRequestQuote={setSelectedQuoteProduct}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8"
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        index={index} 
                        category={category} 
                        addToCart={addToCart} 
                        onRequestQuote={setSelectedQuoteProduct}
                      />
                    ))}
                  </motion.div>
                )
              ) : (
                <EmptyState />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Quotation Modal */}
      <AnimatePresence>
        {selectedQuoteProduct && (
          <QuotationForm 
            product={selectedQuoteProduct}
            isOpen={!!selectedQuoteProduct}
            onClose={() => setSelectedQuoteProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryProductsPage;
