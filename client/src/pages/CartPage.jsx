import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { 
  HiOutlineTrash, 
  HiOutlineMinus, 
  HiOutlinePlus, 
  HiOutlineShoppingBag,
  HiOutlineChevronLeft,
  HiOutlineMail
} from 'react-icons/hi';

const CartPage = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    isIndustrialCart,
    clearCart 
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 pt-28 md:pt-32">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <HiOutlineShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 text-center max-w-md font-medium">
          Looks like you haven't added any industrial equipment or electronics to your cart yet.
        </p>
        <Link 
          to="/shop" 
          className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
        >
          Browse Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-28 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-500 font-medium">Review your items before proceeding to checkout or quotation.</p>
          </div>
          <button 
            onClick={clearCart}
            className="text-sm font-bold text-red-500 hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm flex flex-row items-center gap-4 md:gap-8 group"
                >
                  {/* Image */}
                  <Link to={`/product/${item.slug}`} className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow">
                    <div className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-0.5 md:mb-1">
                      {item.brand} • {item.modelNumber}
                    </div>
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="text-sm md:text-xl font-black text-gray-900 mb-0.5 md:mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-base md:text-2xl font-black text-gray-900">Rs {item.price.toLocaleString()}</p>
                    
                    {/* Quantity Controls - Mobile Only */}
                    <div className="flex md:hidden items-center mt-2 gap-3">
                      <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 scale-90 origin-left">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400"
                        >
                          <HiOutlineMinus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400"
                        >
                          <HiOutlinePlus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 p-2"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Only Actions */}
                  <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                      >
                        <HiOutlineMinus size={18} />
                      </button>
                      <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                      >
                        <HiOutlinePlus size={18} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <HiOutlineTrash size={24} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to="/shop" className="inline-flex items-center gap-2 text-primary font-bold hover:translate-x-[-4px] transition-transform">
              <HiOutlineChevronLeft />
              Continue Shopping
            </Link>
          </div>

          {/* Summary Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm sticky top-32">
              <h3 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">Rs {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Estimated Shipping</span>
                  <span className="text-green-500 font-bold">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium border-t border-gray-50 pt-4 mt-4">
                  <span className="text-xl font-black text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary">Rs {getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/checkout"
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center"
                >
                  Process Order
                </Link>
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Fast & Secure Enterprise Processing <br /> Standard Terms of Trade Apply
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Amount</p>
            <p className="text-xl font-black text-primary leading-none">Rs {getCartTotal().toLocaleString()}</p>
          </div>
          <Link 
            to="/checkout"
            className="px-8 py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
