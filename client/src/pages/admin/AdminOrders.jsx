import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  HiOutlineTruck,
  HiOutlinePlus,
  HiOutlinePrinter,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingId, setTrackingId] = useState('');

  // Manual order features state
  const [showManualModal, setShowManualModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [emailSending, setEmailSending] = useState(false);

  // Manual order form state
  const [customerType, setCustomerType] = useState('guest'); // 'guest' or 'registered'
  const [selectedUserId, setSelectedUserId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Bank Deposit');
  const [selectedItems, setSelectedItems] = useState([
    { productId: '', quantity: 1, customPrice: '' }
  ]);

  const [shippingPrice, setShippingPrice] = useState(250);
  const [taxPrice, setTaxPrice] = useState(0);
  const [manualShippingOverridden, setManualShippingOverridden] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchUsersAndProducts = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/products/all')
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Error fetching users/products:', err);
      toast.error('Failed to load customers or products list');
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
    if (userId) {
      const user = users.find(u => u._id === userId);
      if (user) {
        setShippingAddress(prev => ({
          ...prev,
          phone: user.phone || prev.phone
        }));
      }
    }
  };

  const calculateSubtotal = () => {
    return selectedItems.reduce((sum, item) => {
      const prod = products.find(p => p._id === item.productId);
      const price = item.customPrice !== '' ? parseFloat(item.customPrice) : (prod ? prod.price : 0);
      return sum + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  // Auto calculate shipping
  useEffect(() => {
    if (!manualShippingOverridden && products.length > 0) {
      const calcSub = calculateSubtotal();
      if (calcSub === 0) {
        setShippingPrice(0);
      } else {
        setShippingPrice(calcSub > 5000 ? 0 : 250);
      }
    }
  }, [selectedItems, products, manualShippingOverridden]);

  const handleCreateManualOrder = async (e) => {
    e.preventDefault();

    if (customerType === 'registered' && !selectedUserId) {
      toast.error('Please select a registered customer');
      return;
    }
    if (customerType === 'guest') {
      if (!guestName.trim()) {
        toast.error('Customer name is required');
        return;
      }
      if (!guestEmail.trim()) {
        toast.error('Customer email is required');
        return;
      }
    }

    if (!shippingAddress.address.trim()) {
      toast.error('Shipping address is required');
      return;
    }
    if (!shippingAddress.city.trim()) {
      toast.error('City is required');
      return;
    }
    if (!shippingAddress.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    const validItems = selectedItems.filter(item => item.productId !== '');
    if (validItems.length === 0) {
      toast.error('Please add at least one product to the order');
      return;
    }

    const orderItems = validItems.map(item => {
      const prod = products.find(p => p._id === item.productId);
      const price = item.customPrice !== '' ? parseFloat(item.customPrice) : prod.price;
      return {
        product: prod._id,
        name: prod.name,
        quantity: parseInt(item.quantity),
        image: prod.images && prod.images.length > 0 ? prod.images[0] : 'https://via.placeholder.com/150?text=No+Image',
        price: price
      };
    });

    const subtotal = calculateSubtotal();
    const finalTax = parseFloat(taxPrice) || 0;
    const finalShipping = parseFloat(shippingPrice) || 0;
    const totalPrice = subtotal + finalTax + finalShipping;

    const guestInfo = customerType === 'guest' ? {
      name: guestName,
      email: guestEmail
    } : undefined;

    const orderData = {
      userId: customerType === 'registered' ? selectedUserId : undefined,
      guestInfo,
      orderItems,
      shippingAddress: {
        ...shippingAddress,
        phone: shippingAddress.phone
      },
      paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: finalShipping,
      taxPrice: finalTax,
      totalPrice,
      status: 'Confirmed'
    };

    try {
      setLoading(true);
      const response = await api.post('/api/orders/manual', orderData);
      toast.success('Manual order created successfully!');
      
      setSelectedUserId('');
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setShippingAddress({
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan',
        phone: ''
      });
      setSelectedItems([{ productId: '', quantity: 1, customPrice: '' }]);
      setShippingPrice(250);
      setTaxPrice(0);
      setManualShippingOverridden(false);

      setShowManualModal(false);
      setReceiptOrder(response.data);
      setShowReceiptModal(true);

      fetchOrders();
    } catch (err) {
      console.error('Error creating manual order:', err);
      toast.error(err.response?.data?.message || 'Failed to create manual order');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailReceipt = async () => {
    if (!receiptOrder) return;
    try {
      setEmailSending(true);
      await api.post(`/api/orders/${receiptOrder._id}/send-receipt`);
      toast.success('Receipt emailed successfully to customer!');
    } catch (err) {
      console.error('Error emailing receipt:', err);
      toast.error(err.response?.data?.message || 'Failed to email receipt');
    } finally {
      setEmailSending(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!receiptOrder) return;
    
    const cleanPhone = receiptOrder.shippingAddress.phone.replace(/[^0-9]/g, '');
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '92' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('92') && formattedPhone.length === 10) {
      formattedPhone = '92' + formattedPhone;
    }

    const customerName = receiptOrder.user?.name || receiptOrder.guestInfo?.name || 'Customer';
    const shortId = receiptOrder.orderNumber || receiptOrder._id.slice(-8).toUpperCase();

    const message = `*INVOICE / RECEIPT*\n*Innovative Solutions*\n\nDear *${customerName}*,\nYour order has been created successfully.\n\n*Order Number:* #${shortId}\n*Date:* ${new Date(receiptOrder.createdAt).toLocaleDateString()}\n*Payment Method:* ${receiptOrder.paymentMethod}\n*Status:* ${receiptOrder.status}\n\n*Items:*\n${receiptOrder.orderItems.map(item => `- ${item.name} x ${item.quantity} (Rs ${item.price.toLocaleString()})`).join('\n')}\n\n*Subtotal:* Rs ${receiptOrder.itemsPrice.toLocaleString()}\n*Shipping:* Rs ${receiptOrder.shippingPrice.toLocaleString()}\n*Tax:* Rs ${receiptOrder.taxPrice.toLocaleString()}\n*Total Amount:* Rs ${receiptOrder.totalPrice.toLocaleString()}\n\n*Shipping Address:*\n${receiptOrder.shippingAddress.address}, ${receiptOrder.shippingAddress.city}\n\n*Track order live:* ${window.location.origin}/track-order?id=${shortId}\n\nThank you for choosing Innovative Solutions!`;

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
          <button
            onClick={() => {
              fetchUsersAndProducts();
              setShowManualModal(true);
            }}
            className="px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 text-xs uppercase"
          >
            Create Manual Order
          </button>
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

      {/* Manual Order Modal */}
      {showManualModal && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl relative max-h-[85vh] flex flex-col border border-gray-100 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black text-gray-900">Create Manual Order</h2>
              <button 
                onClick={() => setShowManualModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateManualOrder} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-8 pt-6 overflow-y-auto pr-6 custom-scrollbar flex-grow space-y-6">
                {/* Customer Selection Section */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Type</label>
                      <select
                        value={customerType}
                        onChange={(e) => {
                          setCustomerType(e.target.value);
                          setSelectedUserId('');
                          setGuestName('');
                          setGuestEmail('');
                          setGuestPhone('');
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                      >
                        <option value="guest">Guest Customer (New)</option>
                        <option value="registered">Registered Customer (Existing)</option>
                      </select>
                    </div>

                    {customerType === 'registered' ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Customer</label>
                        <select
                          value={selectedUserId}
                          onChange={(e) => handleUserChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                        >
                          <option value="">-- Choose Customer --</option>
                          {users.map(u => (
                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="Full Name"
                        />
                      </div>
                    )}
                  </div>

                  {customerType === 'guest' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                          type="text"
                          value={guestPhone}
                          onChange={(e) => {
                            setGuestPhone(e.target.value);
                            setShippingAddress(prev => ({ ...prev, phone: e.target.value }));
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="e.g. 03001234567"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping & Payment Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Shipping Address</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                        placeholder="House #, Street name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="e.g. Lahore"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="54000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="Pakistan"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="Phone for delivery"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment & Logistics Option */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment & Logistics</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                      >
                        <option value="Bank Deposit">Bank Deposit</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shipping Price (Rs)</label>
                        <input
                          type="number"
                          value={shippingPrice}
                          onChange={(e) => {
                            setShippingPrice(parseFloat(e.target.value) || 0);
                            setManualShippingOverridden(true);
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="250"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tax Price (Rs)</label>
                        <input
                          type="number"
                          value={taxPrice}
                          onChange={(e) => setTaxPrice(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2 font-bold text-xs text-gray-700">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-black text-gray-900">Rs {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="font-black text-gray-900">Rs {shippingPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span className="font-black text-gray-900">Rs {taxPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black">
                        <span className="text-gray-900">Grand Total:</span>
                        <span className="text-primary">Rs {(subtotal + shippingPrice + taxPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Items / Product Section */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Items</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedItems([...selectedItems, { productId: '', quantity: 1, customPrice: '' }])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary font-black rounded-lg text-[10px] uppercase hover:bg-primary/20 transition-all"
                    >
                      <HiOutlinePlus size={12} /> Add Product
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedItems.map((item, idx) => {
                      const selectedProd = products.find(p => p._id === item.productId);
                      return (
                        <div key={idx} className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                          <div className="flex-1 min-w-[200px] space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Product</label>
                            <select
                              value={item.productId}
                              onChange={(e) => {
                                const newItems = [...selectedItems];
                                newItems[idx].productId = e.target.value;
                                const prod = products.find(p => p._id === e.target.value);
                                newItems[idx].customPrice = prod ? prod.price : '';
                                setSelectedItems(newItems);
                              }}
                              required
                              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                            >
                              <option value="">-- Choose Product --</option>
                              {products.map(p => (
                                <option key={p._id} value={p._id} disabled={p.stock <= 0}>
                                  {p.name} (Rs {p.price.toLocaleString()}) {p.stock <= 0 ? '[OUT OF STOCK]' : `[Stock: ${p.stock}]`}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="w-24 space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...selectedItems];
                                newItems[idx].quantity = parseInt(e.target.value) || 1;
                                setSelectedItems(newItems);
                              }}
                              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                            />
                          </div>

                          <div className="w-32 space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (Rs)</label>
                            <input
                              type="number"
                              value={item.customPrice}
                              onChange={(e) => {
                                const newItems = [...selectedItems];
                                newItems[idx].customPrice = e.target.value;
                                setSelectedItems(newItems);
                              }}
                              placeholder={selectedProd ? selectedProd.price : 'Price'}
                              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                            />
                          </div>

                          <div className="w-28 text-right font-black text-xs text-gray-900 pt-5">
                            Rs {((item.customPrice !== '' ? parseFloat(item.customPrice) || 0 : (selectedProd ? selectedProd.price : 0)) * item.quantity).toLocaleString()}
                          </div>

                          {selectedItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedItems(selectedItems.filter((_, i) => i !== idx));
                              }}
                              className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-all mt-4"
                            >
                              <HiOutlineTrash size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="p-8 py-5 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50/50 rounded-b-[32px]">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs uppercase hover:bg-gray-200 transition-all border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white font-black rounded-xl text-xs uppercase hover:bg-primary-dark shadow-md transition-all flex items-center gap-2"
                >
                  {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  Create Order
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Receipt / Invoice Modal */}
      {showReceiptModal && receiptOrder && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 print-portal-backdrop">
          <style>{`
            @media print {
              /* Hide entire main React root */
              #root {
                display: none !important;
              }
              
              /* Override backdrop wrapper styles for printing */
              .print-portal-backdrop {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: auto !important;
                background: white !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                display: block !important;
                padding: 0 !important;
                margin: 0 !important;
                z-index: auto !important;
              }
              
              /* Override modal card dialog box layout */
              .print-modal-content {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                max-height: none !important;
                border: none !important;
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
                border-radius: 0 !important;
                display: block !important;
                overflow: visible !important;
              }
              
              /* Override scrollable wrapper height/overflow */
              .print-scroll-wrapper {
                overflow: visible !important;
                height: auto !important;
                max-height: none !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
              }
              
              /* Hide screen-only elements */
              .no-print {
                display: none !important;
              }
              
              /* Ensure the printable area has zero border, margin, and fits page */
              #printable-receipt-container {
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                box-shadow: none !important;
              }
            }
          `}</style>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl relative max-h-[85vh] flex flex-col border border-gray-100 overflow-hidden print-modal-content"
          >
            {/* Modal Header */}
            <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-center shrink-0 no-print">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Order Invoice Receipt</h2>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Invoice successfully generated. You can now share or download.</p>
              </div>
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Scrollable Receipt Body */}
            <div className="p-8 pt-6 overflow-y-auto pr-6 custom-scrollbar flex-grow print-scroll-wrapper">
              {/* Printable Area */}
              <div id="printable-receipt-container" className="bg-white p-6 md:p-8 border border-gray-100 rounded-2xl">
                {/* Receipt Header */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">
                        IS
                      </div>
                      <span className="font-black text-lg text-gray-900 tracking-tighter">Innovative Solutions</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Industrial Excellence & Technical Supply</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-black text-gray-900">INVOICE</h3>
                    <span className="text-xs font-black text-primary uppercase block mt-1">
                      Order #{receiptOrder.orderNumber || receiptOrder._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mt-0.5">
                      Date: {new Date(receiptOrder.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Invoice Info Grid */}
                <div className="grid grid-cols-2 gap-6 border-b border-gray-100 pb-6 mb-6 text-xs">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Billed To</span>
                    <p className="font-bold text-gray-800 leading-relaxed">
                      Name: <span className="font-black text-gray-950">{receiptOrder.user?.name || receiptOrder.guestInfo?.name || 'Customer'}</span><br />
                      Email: {receiptOrder.user?.email || receiptOrder.guestInfo?.email || 'N/A'}<br />
                      Phone: {receiptOrder.shippingAddress?.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Shipping Logistics</span>
                    <p className="font-bold text-gray-800 leading-relaxed">
                      {receiptOrder.shippingAddress?.address}<br />
                      {receiptOrder.shippingAddress?.city}, {receiptOrder.shippingAddress?.postalCode}<br />
                      {receiptOrder.shippingAddress?.country}
                    </p>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 gap-6 border-b border-gray-100 pb-6 mb-6 text-xs">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Payment Method</span>
                    <span className="font-black text-gray-900 text-sm uppercase tracking-wide">{receiptOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Order Status</span>
                    <span className="font-black text-emerald-600 text-sm uppercase tracking-wide">{receiptOrder.status}</span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase tracking-widest text-[9px]">
                        <th className="p-3">Product Description</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptOrder.orderItems?.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-50 font-bold text-gray-800">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover border border-gray-100" />
                              <span className="truncate max-w-[250px] font-black text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center text-gray-500 font-bold">x{item.quantity}</td>
                          <td className="p-3 text-right">Rs {item.price.toLocaleString()}</td>
                          <td className="p-3 text-right font-black text-gray-900">Rs {(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Summary */}
                <div className="w-72 ml-auto text-xs space-y-2 font-bold text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400 uppercase tracking-widest text-[9px]">Subtotal</span>
                    <span className="text-gray-900">Rs {receiptOrder.itemsPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 uppercase tracking-widest text-[9px]">Shipping Logistics</span>
                    <span className="text-gray-900">
                      {receiptOrder.shippingPrice === 0 ? 'Complimentary' : `Rs ${receiptOrder.shippingPrice?.toLocaleString()}`}
                    </span>
                  </div>
                  {receiptOrder.taxPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase tracking-widest text-[9px]">Tax</span>
                      <span className="text-gray-900">Rs {receiptOrder.taxPrice?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black">
                    <span className="text-gray-900 uppercase tracking-widest text-[10px]">Grand Total</span>
                    <span className="text-primary text-base">Rs {receiptOrder.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Modal Footer */}
            <div className="flex flex-wrap justify-end gap-3 p-8 py-5 border-t border-gray-100 no-print shrink-0 bg-gray-50/50 rounded-b-[32px]">
              <button
                onClick={() => window.print()}
                className="px-5 py-3 bg-white text-gray-750 hover:bg-gray-50 font-bold rounded-xl text-xs uppercase transition-all flex items-center gap-2 border border-gray-200"
              >
                <HiOutlinePrinter size={16} /> Print Receipt
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-5 py-3 bg-emerald-500 text-white hover:bg-emerald-600 font-black rounded-xl text-xs uppercase shadow-md hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <FaWhatsapp size={16} /> WhatsApp
              </button>
              <button
                disabled={emailSending}
                onClick={handleSendEmailReceipt}
                className="px-5 py-3 bg-primary text-white hover:bg-primary-dark font-black rounded-xl text-xs uppercase shadow-md hover:shadow-primary/20 transition-all flex items-center gap-2"
              >
                {emailSending ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <HiOutlineMail size={16} />
                )}
                Send Email
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-5 py-3 bg-gray-800 text-white hover:bg-gray-900 font-bold rounded-xl text-xs uppercase transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminOrders;
