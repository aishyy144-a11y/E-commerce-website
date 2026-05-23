import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineShoppingBag, 
  HiOutlineTrash, 
  HiOutlineCheck, 
  HiOutlineClock, 
  HiOutlineX,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineTruck
} from 'react-icons/hi';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders');
      setOrders(response.data);
      // Update selected order reference if it exists
      if (selectedOrder) {
        const updated = response.data.find(o => o._id === selectedOrder._id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const data = { status };
      if (status === 'Shipped' && trackingId) {
        data.trackingId = trackingId;
      }
      
      await api.put(`/api/orders/${id}/status`, data);
      toast.success(`Order ${status} Successfully`);
      setTrackingId('');
      fetchOrders();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order permanently?')) return;
    try {
      await api.delete(`/api/orders/${id}`);
      toast.success('Order deleted');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-500 font-medium">Track and process industrial equipment orders.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-sm font-black text-gray-900">{orders.filter(o => o.status === 'Pending').length}</span>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2">Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order List */}
        <div className="lg:col-span-2 space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-gray-100">
              <HiOutlineShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order._id}
                layout
                onClick={() => setSelectedOrder(order)}
                className={`bg-white p-6 rounded-[32px] border-2 transition-all cursor-pointer hover:shadow-xl ${selectedOrder?._id === order._id ? 'border-primary' : 'border-white shadow-sm hover:border-gray-100'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(order.status)}`}>
                      <HiOutlineShoppingBag size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 line-clamp-1">Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.user?.name || order.guestInfo?.name || 'Guest'}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rs {order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden sticky top-24"
              >
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                      <HiOutlineX size={24} />
                    </button>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">Order Details</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: {selectedOrder.orderNumber || selectedOrder._id}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">DB ID: {selectedOrder._id}</p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Items */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordered Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.quantity} x Rs {item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Shipping Logistics</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm font-bold text-gray-700">
                        <HiOutlineLocationMarker className="text-primary mt-0.5" size={18} />
                        <span>{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <HiOutlinePhone className="text-primary" size={18} />
                        {selectedOrder.shippingAddress.phone}
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-400 uppercase tracking-widest">Payment Method</span>
                      <span className="text-gray-900">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-400 uppercase tracking-widest">Tax (15%)</span>
                      <span className="text-gray-900">Rs {selectedOrder.taxPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Total Amount</span>
                      <span className="text-xl font-black text-primary">Rs {selectedOrder.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    {selectedOrder.status === 'Processing' && (
                      <div className="space-y-2 mb-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tracking ID (Required for Shipping)</label>
                        <input 
                          type="text" 
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="Enter tracking number (e.g. TCS-12345)"
                        />
                      </div>
                    )}

                    {selectedOrder.trackingId && (
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
                        <span className="block text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Tracking ID</span>
                        <span className="text-xs font-black text-blue-700">{selectedOrder.trackingId}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Confirmed')}
                        className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl text-[10px] uppercase hover:bg-emerald-100 transition-all"
                      >
                        <HiOutlineCheck size={16} />
                        Confirm
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Processing')}
                        className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-[10px] uppercase hover:bg-blue-100 transition-all"
                      >
                        <HiOutlineClock size={16} />
                        Process
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Shipped')}
                        className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-[10px] uppercase hover:bg-indigo-100 transition-all"
                      >
                        <HiOutlineTruck size={16} />
                        Ship
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Delivered')}
                        className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 font-bold rounded-xl text-[10px] uppercase hover:bg-green-100 transition-all"
                      >
                        <HiOutlineCheck size={16} />
                        Deliver
                      </button>
                    </div>
                    <button 
                      onClick={() => updateStatus(selectedOrder._id, 'Cancelled')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 font-bold rounded-xl text-[10px] uppercase hover:bg-red-100 transition-all"
                    >
                      <HiOutlineX size={16} />
                      Cancel Order
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 rounded-[40px] p-12 text-center border-2 border-dashed border-gray-200 h-96 flex flex-col items-center justify-center">
                <HiOutlineShoppingBag size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold max-w-[150px]">Select an order to view full technical details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
