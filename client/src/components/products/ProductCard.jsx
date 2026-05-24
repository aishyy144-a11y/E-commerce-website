import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineShoppingBag, 
  HiOutlineMail, 
  HiOutlineCube, 
  HiOutlineLightningBolt,
  HiOutlineStar,
  HiOutlineHeart,
  HiHeart
} from 'react-icons/hi';

const ProductCard = ({ product, index, category, addToCart, onRequestQuote }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { clearCart, toggleWishlist, isInWishlist } = useCart();

  const handleBuyNow = (e) => {
    e.preventDefault();
    clearCart();
    addToCart(product, 1, true); // true for silent mode (no toast)
    navigate('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-sm hover:shadow-2xl transition-all group border border-gray-100 flex flex-col relative"
    >
      {/* Product Image Section */}
      <Link to={`/product/${product.slug}`} state={{ from: location.pathname }} className="block">
        <div className="relative aspect-[4/3] md:aspect-[3/2] rounded-[18px] md:rounded-[24px] overflow-hidden mb-2 bg-gray-50">
          <img 
            src={product.images[0] || 'https://via.placeholder.com/400x300'} 
            alt={product.name}
            crossOrigin="anonymous"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Status Badges */}
          <div className="absolute top-2 md:top-3 left-2 md:left-3 flex flex-col gap-1 md:gap-1.5">
            <div className={`text-[7px] md:text-[9px] font-black px-1.5 md:px-2.5 py-0.5 rounded-full uppercase tracking-widest w-fit shadow-sm border ${
              product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          {/* Wishlist Toggle */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (!user) {
                navigate('/login', { state: { from: location.pathname } });
              } else {
                toggleWishlist(product);
              }
            }}
            className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg backdrop-blur-md border transition-all ${
              isInWishlist(product._id) 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white/90 text-gray-400 border-white/20 hover:text-primary'
            }`}
          >
            {isInWishlist(product._id) ? <HiHeart size={14} className="md:size-[16px]" /> : <HiOutlineHeart size={14} className="md:size-[16px]" />}
          </button>
        </div>
      </Link>

      {/* Product Content */}
      <div className="flex-grow px-1 md:px-0">
        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
          <span className="text-[7px] md:text-[9px] font-black text-primary uppercase tracking-[0.1em] md:tracking-[0.2em] truncate max-w-[60px] md:max-w-none">
            {category?.name || 'Industrial'}
          </span>
          <div className="w-0.5 h-0.5 bg-gray-200 rounded-full"></div>
          <span className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">
            {product.brand}
          </span>
        </div>

        <Link to={`/product/${product.slug}`} state={{ from: location.pathname }}>
          <h3 className="text-xs md:text-base font-black text-gray-900 mb-0.5 group-hover:text-primary transition-colors line-clamp-2 leading-tight min-h-[2.4em] md:min-h-0">
            {product.name}
          </h3>
        </Link>
        
        <p className="hidden md:flex text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 items-center gap-1.5">
          <HiOutlineCube size={12} className="text-primary" />
          PN: {product.modelNumber}
        </p>

        {/* Short Specs - Hidden on small mobile to save space */}
        <div className="hidden md:flex flex-wrap gap-1 mb-1.5">
          {product.specifications && Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
            <div key={key} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-bold rounded-md border border-gray-100 uppercase tracking-tighter">
              {value}
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-2 border-t border-gray-50 px-1 md:px-0">
        <div className="flex items-baseline justify-between mb-1.5 md:mb-2">
          <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-1">
            <span className="text-sm md:text-lg font-black text-gray-900 tracking-tighter leading-none">Rs {product.price.toLocaleString()}</span>
            <span className="text-[6px] md:text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Excl. VAT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          {!product.requiresQuote ? (
            <>
              <button 
                onClick={() => addToCart(product)}
                className="flex items-center justify-center gap-1 md:gap-2 py-1.5 md:py-2.5 bg-primary text-white text-[8px] md:text-[10px] font-black rounded-lg md:rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                <HiOutlineShoppingBag size={12} className="md:size-[14px]" />
                <span className="md:hidden">ADD</span>
                <span className="hidden md:inline">ADD TO CART</span>
              </button>
              <button 
                onClick={handleBuyNow}
                className="py-1.5 md:py-2.5 bg-gray-900 text-white text-[8px] md:text-[10px] font-black rounded-lg md:rounded-xl hover:bg-black transition-all"
              >
                BUY NOW
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate(`/product/${product.slug}`)}
              className="col-span-full py-1.5 md:py-2.5 bg-amber-600 text-white text-[8px] md:text-[10px] font-black rounded-lg md:rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 uppercase tracking-widest"
            >
              Request Quote
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
