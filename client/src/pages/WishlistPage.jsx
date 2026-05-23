import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineHeart, 
  HiOutlineShoppingBag, 
  HiOutlineTrash, 
  HiOutlineArrowRight,
  HiOutlineCube
} from 'react-icons/hi';
import ProductCard from '../components/products/ProductCard';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">My Wishlist</h1>
            <p className="text-gray-500 font-medium">Items you've saved for later.</p>
          </div>
          <Link 
            to="/shop" 
            className="flex items-center gap-2 text-primary font-black uppercase tracking-widest hover:gap-4 transition-all"
          >
            Continue Shopping <HiOutlineArrowRight />
          </Link>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <ProductCard 
                    product={product} 
                    index={index} 
                    category={product.category} 
                    addToCart={addToCart}
                  />
                  <button 
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg border border-red-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20"
                    title="Remove from wishlist"
                  >
                    <HiOutlineTrash size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineHeart size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 font-medium mb-8">Save items you're interested in to keep track of them.</p>
            <Link 
              to="/shop"
              className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all inline-flex items-center gap-3"
            >
              Explore Products <HiOutlineArrowRight />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
