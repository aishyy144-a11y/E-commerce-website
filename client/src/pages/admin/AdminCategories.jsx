import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineX,
  HiOutlineFolderOpen,
  HiOutlinePhotograph
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import ImageUploadWithCrop from '../../components/admin/ImageUploadWithCrop';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This may affect products in this category.')) return;
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (editingCategory) {
        await axios.put(`http://localhost:5000/api/categories/${editingCategory._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/categories', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category created');
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', image: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Category Management</h1>
          <p className="text-gray-500 font-medium">Organize your industrial product lines.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({ name: '', slug: '', description: '', image: '' }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
        >
          <HiOutlinePlus size={20} />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <motion.div
            key={cat._id}
            layout
            className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="aspect-video bg-gray-50 relative overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <HiOutlinePhotograph size={48} />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => handleEdit(cat)} className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                  <HiOutlinePencil size={18} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all">
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-black text-gray-900 mb-2">{cat.name}</h3>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">/{cat.slug}</p>
              <p className="text-gray-500 text-sm line-clamp-2 font-medium">
                {cat.description || 'No description provided for this sector.'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowModal(false)} 
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-0" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-white w-full max-w-md rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header - Fixed */}
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white z-20">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-all hover:rotate-90"
                >
                  <HiOutlineX size={20} />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-8 pt-4 overflow-y-auto custom-scrollbar flex-grow">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                    <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="Enter category name" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Slug</label>
                    <input required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="Enter URL slug" />
                  </div>

                  <div className="py-2">
                    <ImageUploadWithCrop 
                      label="Category Image"
                      value={formData.image}
                      onChange={(val) => setFormData({...formData, image: val})}
                      aspect={16 / 9}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" placeholder="Enter category description" />
                  </div>

                  <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
