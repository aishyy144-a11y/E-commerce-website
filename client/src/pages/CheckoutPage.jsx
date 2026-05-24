import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineTruck, 
  HiOutlineCreditCard, 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlineChevronLeft,
  HiOutlineCheckCircle,
  HiOutlineCash,
  HiOutlineLibrary,
  HiOutlineLockClosed
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, token, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    paymentMethod: 'Bank Deposit',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // No longer redirecting to login automatically
  /*
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info('Please sign in to complete your order');
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, authLoading, navigate, location.pathname]);
  */

  const subtotal = getCartTotal();
  const shippingPrice = subtotal > 5000 ? 0 : 250;
  const taxPrice = 0; // Tax usually included or zero for industrial items in this context
  const totalPrice = subtotal + shippingPrice + taxPrice;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150?text=No+Image',
          price: item.price,
          product: item._id
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
        guestInfo: !user ? {
          name: formData.name,
          email: formData.email
        } : undefined
      };

      const response = await api.post('/api/orders', orderData);

      setOrderId(response.data._id);
      const assignedOrderNumber = response.data.orderNumber || response.data._id.toString().slice(-8).toUpperCase();
      setIsSuccess(true);
      setOrderId(assignedOrderNumber); // Temporarily store the short ID for display
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'Bank Deposit', name: 'Bank Deposit', icon: HiOutlineLibrary, description: 'Direct bank transfer or deposit' },
    { id: 'Credit Card', name: 'Credit Card', icon: HiOutlineCreditCard, description: 'Pay via Visa/MasterCard' },
    { id: 'Cash on Delivery', name: 'Cash on Delivery', icon: HiOutlineCash, description: 'Pay when items arrive' }
  ];

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
        <div className="max-w-2xl w-full flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-32 h-32 bg-green-50 rounded-[40px] flex items-center justify-center text-green-500 mb-8"
          >
            <HiOutlineCheckCircle size={80} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Order Placed!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-lg mb-12 max-w-md leading-relaxed"
          >
            Thank you for your purchase. Your order <span className="text-primary font-bold">#{orderId}</span> has been successfully registered in our system. 
            <br /><br />
            A confirmation email with tracking details will be sent to you shortly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm"
          >
            <button 
              onClick={() => navigate(`/track-order?id=${orderId}`)}
              className="flex-1 px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1"
            >
              Track Order
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 px-10 py-5 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all transform hover:-translate-y-1"
            >
              Return Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-primary mb-6 md:mb-12 transition-colors"
        >
          <HiOutlineChevronLeft />
          Back to Cart
        </button>

        <form id="checkout-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            {/* Checkout Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 md:space-y-12"
            >
              <section>
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <HiOutlineTruck size={20} className="md:size-[24px]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">Shipping Logistics</h2>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {!user && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-blue-50/50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-blue-100 mb-6"
                    >
                      <div className="md:col-span-2 mb-2">
                        <h3 className="text-xs md:text-sm font-black text-blue-900 uppercase tracking-widest">Guest Checkout</h3>
                        <p className="text-[9px] md:text-[10px] text-blue-600 font-bold uppercase">Enter your contact details to proceed without an account.</p>
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          required name="name" value={formData.name} onChange={handleChange}
                          className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 shadow-sm text-sm md:text-base"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          required type="email" name="email" value={formData.email} onChange={handleChange}
                          className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 shadow-sm text-sm md:text-base"
                          placeholder="email@example.com"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                      <div className="relative">
                        <input 
                          required name="address" value={formData.address} onChange={handleChange}
                          className="w-full pl-11 md:pl-12 pr-4 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 shadow-sm text-sm md:text-base"
                          placeholder="House No, Street Name"
                        />
                        <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} className="md:size-[20px]" />
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                      <input 
                        required name="city" value={formData.city} onChange={handleChange}
                        className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 shadow-sm text-sm md:text-base"
                        placeholder="e.g. Lahore, Karachi"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                      <input 
                        required name="postalCode" value={formData.postalCode} onChange={handleChange}
                        className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 shadow-sm text-sm md:text-base"
                        placeholder="54000"
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                      <input 
                        required name="country" value={formData.country} onChange={handleChange}
                        className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 shadow-sm text-sm md:text-base"
                        placeholder="Pakistan"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <input 
                        required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full pl-11 md:pl-12 pr-4 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 shadow-sm text-sm md:text-base"
                        placeholder="03XX-XXXXXXX"
                      />
                      <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} className="md:size-[20px]" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <HiOutlineCreditCard size={20} className="md:size-[24px]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">Payment Protocol</h2>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="space-y-3 md:space-y-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`w-full p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-2 transition-all text-left flex items-center gap-4 md:gap-6 group ${
                          formData.paymentMethod === method.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-white bg-white hover:border-gray-100 shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${
                          formData.paymentMethod === method.id ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:text-primary'
                        }`}>
                          <method.icon size={20} className="md:size-[28px]" />
                        </div>
                        <div>
                          <span className={`block font-black uppercase tracking-widest text-[10px] md:text-xs mb-0.5 md:mb-1 ${
                            formData.paymentMethod === method.id ? 'text-primary' : 'text-gray-900'
                          }`}>{method.name}</span>
                          <p className="text-gray-500 text-[8px] md:text-[10px] font-medium uppercase tracking-widest">{method.description}</p>
                        </div>
                      </button>

                      <AnimatePresence>
                        {formData.paymentMethod === method.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            {method.id === 'Bank Deposit' && (
                              <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-4 shadow-sm">
                                <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Bank Account Details</h4>
                                <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-bold text-gray-400 uppercase tracking-tighter">Bank Name</span>
                                    <span className="font-black text-gray-900">Meezan Bank</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="font-bold text-gray-400 uppercase tracking-tighter">Account Title</span>
                                    <span className="font-black text-gray-900">Innovative Solutions</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="font-bold text-gray-400 uppercase tracking-tighter">Account Number</span>
                                    <span className="font-black text-gray-900">0123-456789-012</span>
                                  </div>
                                </div>
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 p-4 rounded-xl border border-amber-100">
                                  Please share screenshot of deposit slip on WhatsApp (03117702133) after payment.
                                </p>
                              </div>
                            )}

                            {method.id === 'Credit Card' && (
                              <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Secure Card Payment</h4>
                                  <HiOutlineLockClosed className="text-emerald-500" />
                                </div>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                                    <input 
                                      name="cardName" value={formData.cardName} onChange={handleChange}
                                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                                      placeholder="Full Name on Card"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                                    <div className="relative">
                                      <input 
                                        name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                                        placeholder="0000 0000 0000 0000"
                                      />
                                      <HiOutlineCreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                      <input 
                                        name="cardExpiry" value={formData.cardExpiry} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                                        placeholder="MM/YY"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">CVC / CVV</label>
                                      <input 
                                        name="cardCVC" value={formData.cardCVC} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                                        placeholder="123"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {method.id === 'Cash on Delivery' && (
                              <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 shadow-sm">
                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] leading-relaxed">
                                  Pay with cash when your technical equipment is delivered to your doorstep. Our logistics team will contact you before arrival.
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>


            {/* Order Summary Sidebar */}
            <motion.aside 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-32 h-fit"
            >
              <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">Order Summary</h3>
                </div>

                <div className="p-6 md:p-10 space-y-6 md:space-y-8">
                  {/* Cart Items Preview */}
                  <div className="space-y-4 max-h-[200px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-black text-gray-900 text-xs md:text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity} × Rs {item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-xs md:text-sm font-black text-gray-900">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-gray-50">
                    <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-gray-900">Rs {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500">
                      <span>Shipping Logistics</span>
                      <span className={shippingPrice === 0 ? 'text-green-500' : 'text-gray-900'}>
                        {shippingPrice === 0 ? 'Complimentary' : `Rs ${shippingPrice.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-gray-50">
                      <span className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter">Total Investment</span>
                      <span className="text-2xl md:text-3xl font-black text-primary tracking-tighter">Rs {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 md:py-5 bg-primary text-white font-black rounded-xl md:rounded-[24px] shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 text-sm md:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      'Finalize Secure Order'
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                    By placing this order, you agree to our <br /> Enterprise Terms of Trade & Logistics Policy.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
