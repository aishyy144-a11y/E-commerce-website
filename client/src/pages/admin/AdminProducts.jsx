import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineExternalLink
} from 'react-icons/hi';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await api.get('/api/products/all?fields=card');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: () => {
      alert('Error deleting product');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-500 font-medium">Manage and update your technical product catalog.</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
        >
          <HiOutlinePlus size={20} />
          Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Enter product name, model, or brand to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[32px] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
        />
        <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Model & Brand</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Price & Stock</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <motion.tr 
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 line-clamp-1">{product.name}</p>
                            <Link to={`/product/${product.slug}`} className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                              View Live <HiOutlineExternalLink />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-gray-700">{product.modelNumber}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase">{product.brand}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-primary-light text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-lg font-black text-gray-900">Rs {product.price.toLocaleString()}</p>
                        <p className={`text-[10px] font-bold uppercase ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                          {product.stock} units in stock
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to={`/admin/products/edit/${product._id}`}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <HiOutlinePencilAlt size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium">
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
