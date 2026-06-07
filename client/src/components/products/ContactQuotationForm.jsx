import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineChatAlt,
  HiOutlineCheckCircle,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineShoppingBag
} from 'react-icons/hi';
import api from '../../utils/api';

const ContactQuotationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: 1,
    message: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setSearching(true);
        try {
          const res = await api.get(`/api/products/search?query=${encodeURIComponent(searchQuery)}`);
          setSearchResults(res.data);
        } catch {
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddProduct = (product) => {
    if (selectedProducts.some(p => p._id === product._id)) return;
    setSelectedProducts(prev => [...prev, product]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      setError('Please add at least one product to your quotation request.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/inquiries', {
        ...formData,
        products: selectedProducts.map(p => p._id),
        phone: formData.phone || 'Not Provided'
      });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quotation request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 p-12 rounded-[40px] text-center border border-green-100"
      >
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-green-500 mx-auto mb-6 shadow-lg shadow-green-200/50">
          <HiOutlineCheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-black text-green-900 mb-2">Quotation Request Received</h3>
        <p className="text-green-700 font-medium">Our team will review your product requirements and send a custom quote within 24 hours.</p>
        <button
          onClick={() => { setSubmitted(false); setSelectedProducts([]); setFormData({ name: '', email: '', phone: '', company: '', quantity: 1, message: '' }); }}
          className="mt-8 text-xs font-black text-green-800 uppercase tracking-widest hover:underline"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
          {error}
        </div>
      )}

      {/* Product Search */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Products for Quotation</label>
        <div className="relative">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
            placeholder="Search products by name, model, or brand..."
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg max-h-48 overflow-y-auto">
            {searchResults.map(product => (
              <button
                key={product._id}
                type="button"
                onClick={() => handleAddProduct(product)}
                className="w-full text-left px-4 py-3 hover:bg-primary/5 border-b border-gray-50 last:border-0 transition-colors"
              >
                <p className="font-black text-gray-900 text-sm">{product.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {product.brand} {product.modelNumber ? `• ${product.modelNumber}` : ''}
                  {product.price ? ` • Rs ${product.price.toLocaleString()}` : ''}
                </p>
              </button>
            ))}
          </div>
        )}

        {selectedProducts.length > 0 && (
          <div className="space-y-2">
            {selectedProducts.map(product => (
              <div key={product._id} className="flex items-center gap-3 bg-primary/5 border border-primary/10 p-4 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary border border-primary/10 flex-shrink-0">
                  <HiOutlineShoppingBag size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm truncate">{product.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold">
                    {product.brand} {product.modelNumber ? `• Model: ${product.modelNumber}` : ''}
                    {product.price ? ` • Rs ${product.price.toLocaleString()}` : ' • Price on request'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <HiOutlineX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative">
            <input
              required type="text"
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
          <div className="relative">
            <input
              required type="email"
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
          <div className="relative">
            <input
              required type="tel"
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
              placeholder="Optional"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estimated Quantity (per product)</label>
        <input
          type="number" min="1"
          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Requirements</label>
        <div className="relative">
          <textarea
            required rows="4"
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
            placeholder="Describe your project, delivery timeline, or special requirements..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <HiOutlineChatAlt className="absolute left-4 top-4 text-gray-400" size={18} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        ) : (
          'Submit Quotation Request'
        )}
      </button>
    </form>
  );
};

export default ContactQuotationForm;
