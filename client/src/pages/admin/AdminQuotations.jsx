import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineChatAlt, 
  HiOutlineTrash, 
  HiOutlineCheck, 
  HiOutlineClock, 
  HiOutlineX,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineExternalLink,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import GenerateQuotationModal from '../../components/admin/GenerateQuotationModal';


const AdminQuotations = () => {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  const { data: inquiries = [], isLoading: loading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const response = await api.get('/api/inquiries');
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/inquiries/${id}/status`, { status });
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`/api/inquiries/${id}`);
      toast.success('Inquiry deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      setSelectedInquiry(null);
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  const getInquiryTitle = (inquiry) => {
    if (inquiry.products?.length > 0) {
      return inquiry.products.length === 1
        ? inquiry.products[0].name
        : `${inquiry.products.length} Products Quotation`;
    }
    if (inquiry.product) return inquiry.product.name;
    return inquiry.subject || 'General Inquiry';
  };

  const isQuotationRequest = (inquiry) => {
    return inquiry.product || (inquiry.products && inquiry.products.length > 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'contacted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Quotation Requests</h1>
          <p className="text-gray-500 font-medium">Manage and track industrial product inquiries.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-sm font-black text-gray-900">{inquiries.filter(i => i.status === 'pending').length}</span>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2">Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inquiry List */}
        <div className="lg:col-span-2 space-y-4">
          {inquiries.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-gray-100">
              <HiOutlineChatAlt size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No quotation requests found</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <motion.div
                key={inquiry._id}
                layout
                onClick={() => setSelectedInquiry(inquiry)}
                className={`bg-white p-6 rounded-[32px] border-2 transition-all cursor-pointer hover:shadow-xl ${selectedInquiry?._id === inquiry._id ? 'border-primary' : 'border-white shadow-sm hover:border-gray-100'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(inquiry.status)}`}>
                      <HiOutlineChatAlt size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 line-clamp-1">
                        {getInquiryTitle(inquiry)}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{inquiry.name}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isQuotationRequest(inquiry) ? 'text-amber-500' : 'text-primary'}`}>
                          {isQuotationRequest(inquiry) ? 'Quotation' : 'General Query'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedInquiry ? (
              <motion.div
                key={selectedInquiry._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden sticky top-24"
              >
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </div>
                    <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                      <HiOutlineX size={24} />
                    </button>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                    {getInquiryTitle(selectedInquiry)}
                  </h2>
                  {isQuotationRequest(selectedInquiry) ? (
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Quotation Request</p>
                  ) : (
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">General Query from Contact Page</p>
                  )}
                </div>

                <div className="p-8 space-y-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <HiOutlineUser className="text-primary" size={20} />
                        {selectedInquiry.name}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <HiOutlineMail className="text-primary" size={20} />
                        {selectedInquiry.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <HiOutlinePhone className="text-primary" size={20} />
                        {selectedInquiry.phone}
                      </div>
                      {selectedInquiry.company && (
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                          <HiOutlineOfficeBuilding className="text-primary" size={20} />
                          {selectedInquiry.company}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Requested Products */}
                  {selectedInquiry.product && !selectedInquiry.products?.length && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Requested Product</h4>
                      <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
                        <p className="font-black text-gray-900 text-sm">{selectedInquiry.product.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-1">
                          {selectedInquiry.product.brand} {selectedInquiry.product.modelNumber ? `• ${selectedInquiry.product.modelNumber}` : ''}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedInquiry.products?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Requested Products</h4>
                      <div className="space-y-2">
                        {selectedInquiry.products.map(p => (
                          <div key={p._id} className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
                            <p className="font-black text-gray-900 text-sm">{p.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold mt-1">
                              {p.brand} {p.modelNumber ? `• ${p.modelNumber}` : ''}
                              {p.price ? ` • Rs ${p.price.toLocaleString()}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {selectedInquiry.subject ? `Subject: ${selectedInquiry.subject}` : 'Inquiry Message'}
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-2xl text-sm font-medium text-gray-600 leading-relaxed border border-gray-100 italic">
                      "{selectedInquiry.message}"
                    </div>
                    {isQuotationRequest(selectedInquiry) && selectedInquiry.quantity && (
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Requested Quantity:</span>
                        <span className="text-gray-900">{selectedInquiry.quantity} Units</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    {isQuotationRequest(selectedInquiry) && (
                    <button 
                      onClick={() => setIsQuotationModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-dark shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
                    >
                      <HiOutlineDocumentText size={16} />
                      Generate & Send Quotation
                    </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateStatus(selectedInquiry._id, 'contacted')}
                        className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-100 transition-all"
                      >
                        <HiOutlineClock size={16} />
                        Contacted
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedInquiry._id, 'resolved')}
                        className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 font-bold rounded-xl text-xs hover:bg-green-100 transition-all"
                      >
                        <HiOutlineCheck size={16} />
                        Resolved
                      </button>
                    </div>
                    <button 
                      onClick={() => deleteInquiry(selectedInquiry._id)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 font-bold rounded-xl text-xs hover:bg-red-100 transition-all"
                    >
                      <HiOutlineTrash size={16} />
                      Delete Inquiry
                    </button>
                    {selectedInquiry.product && (
                      <Link 
                        to={`/product/${selectedInquiry.product.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-200 transition-all"
                      >
                        <HiOutlineExternalLink size={16} />
                        View Product
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 rounded-[40px] p-12 text-center border-2 border-dashed border-gray-200 h-96 flex flex-col items-center justify-center">
                <HiOutlineChatAlt size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold max-w-[150px]">Select an inquiry to view details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <GenerateQuotationModal 
        inquiry={selectedInquiry}
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
      />
    </div>
  );
};

export default AdminQuotations;
