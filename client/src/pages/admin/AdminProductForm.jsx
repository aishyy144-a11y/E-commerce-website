import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  HiOutlineSave, 
  HiOutlineArrowLeft, 
  HiOutlinePlus, 
  HiOutlineX 
} from 'react-icons/hi';
import ImageUploadWithCrop from '../../components/admin/ImageUploadWithCrop';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    modelNumber: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [''],
    specifications: {},
    requiresQuote: false
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/categories');
      return response.data;
    }
  });

  const { isLoading: isProductLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/products/all`);
      const product = response.data.find(p => p._id === id);
      if (product) {
        setFormData({
          ...product,
          category: product.category._id,
          images: product.images.length > 0 ? product.images : [''],
          specifications: product.specifications || {}
        });
      }
      return product;
    },
    enabled: isEdit
  });

  const mutation = useMutation({
    mutationFn: async (dataToSubmit) => {
      const token = sessionStorage.getItem('token');
      if (isEdit) {
        return axios.put(`http://localhost:5000/api/products/${id}`, dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        return axios.post('http://localhost:5000/api/products', dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['latest-products']);
      queryClient.invalidateQueries(['shop-data']);
      navigate('/admin/products');
    },
    onError: (err) => {
      alert('Error saving product: ' + (err.response?.data?.message || err.message));
    }
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '', isSingleLine: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleAddSpec = () => {
    if (newSpec.value && (newSpec.isSingleLine || newSpec.key)) {
      const finalKey = newSpec.isSingleLine ? `line_${Date.now()}` : newSpec.key;
      setFormData(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [finalKey]: newSpec.value }
      }));
      setNewSpec({ key: '', value: '', isSingleLine: false });
    }
  };

  const removeSpec = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: At least one image required
    if (!formData.images.some(img => img && img.trim() !== '')) {
      alert('Please upload at least one product image');
      return;
    }

    const dataToSubmit = {
      ...formData,
      slug: formData.slug || `${formData.name}${formData.modelNumber ? '-' + formData.modelNumber : ''}`.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    mutation.mutate(dataToSubmit);
  };

  if (isEdit && isProductLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/admin/products')}
          className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-all"
        >
          <HiOutlineArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-500 font-medium">Configure industrial equipment specifications and details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Basic Information */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-6">
            <span className="w-8 h-8 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">1</span>
            General Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Model Number</label>
              <input 
                type="text" name="modelNumber" value={formData.modelNumber} onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                placeholder="Enter model number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Brand</label>
              <input 
                type="text" name="brand" value={formData.brand} onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                placeholder="Enter brand name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
              <select 
                name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-600 appearance-none"
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} required rows="4"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium leading-relaxed"
              placeholder="Enter full technical description and details"
            />
          </div>
        </div>

        {/* Pricing and Stock */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-6">
            <span className="w-8 h-8 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">2</span>
            Inventory & Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Price (Rs)</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange} required
                onWheel={(e) => e.target.blur()}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black text-2xl"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Stock Level</label>
              <input 
                type="number" name="stock" value={formData.stock} onChange={handleChange} required
                onWheel={(e) => e.target.blur()}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black text-2xl"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-6">
            <span className="w-8 h-8 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">3</span>
            Technical Specifications
          </h3>

          <div className="space-y-4">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group">
                <div className="flex-1">
                  {key.startsWith('line_') ? (
                    <span className="text-sm font-bold text-gray-700">{value}</span>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{key}</span>
                      <span className="text-sm font-bold text-gray-700">{value}</span>
                    </div>
                  )}
                </div>
                <button 
                  type="button" onClick={() => removeSpec(key)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <HiOutlineX size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-primary-light p-6 rounded-3xl border border-primary/10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Add Technical Specification</span>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setNewSpec(prev => ({ ...prev, isSingleLine: false }))}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${!newSpec.isSingleLine ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
                  >
                    Key-Value Pair
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewSpec(prev => ({ ...prev, isSingleLine: true }))}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${newSpec.isSingleLine ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
                  >
                    Single Line
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                {!newSpec.isSingleLine ? (
                  <>
                    <div className="flex-1 space-y-1">
                      <input 
                        type="text" value={newSpec.key} onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:outline-none text-sm font-bold"
                        placeholder="Name (e.g. Voltage)"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <input 
                        type="text" value={newSpec.value} onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:outline-none text-sm font-bold"
                        placeholder="Value (e.g. 52.8 V)"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 space-y-1">
                    <input 
                      type="text" value={newSpec.value} onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value, key: '' }))}
                      className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:outline-none text-sm font-bold"
                      placeholder="Enter description line (e.g. Waterproof IP67 certified)"
                    />
                  </div>
                )}
                <button 
                  type="button" onClick={handleAddSpec}
                  className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                  <HiOutlinePlus size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-6">
            <span className="w-8 h-8 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">4</span>
            Product Images
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.images.map((img, index) => (
              <div key={index} className="relative group">
                <ImageUploadWithCrop 
                  label={`Product Image ${index + 1}`}
                  value={img}
                  onChange={(val) => handleImageChange(index, val)}
                  aspect={1 / 1}
                />
                {formData.images.length > 1 && (
                  <button 
                    type="button" onClick={() => removeImageField(index)}
                    className="absolute top-0 right-0 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all z-10"
                  >
                    <HiOutlineX size={16} />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" onClick={addImageField}
              className="flex flex-col items-center justify-center aspect-square bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-2xl hover:border-primary hover:text-primary transition-all group gap-2"
            >
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <HiOutlinePlus size={20} />
              </div>
              <span className="text-xs uppercase tracking-widest">Add Image</span>
            </button>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex gap-4">
          <button 
            type="submit" disabled={mutation.isLoading}
            className="flex-1 py-6 bg-primary text-white font-black text-xl rounded-[32px] shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {mutation.isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <HiOutlineSave size={24} />
                {isEdit ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
