import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import DroneProductSpecs from '../components/home/DroneProductSpecs';
import LMRProductSpecs from '../components/home/LMRProductSpecs';
import CameraProductSpecs from '../components/home/CameraProductSpecs';
import TelephoneProductSpecs from '../components/home/TelephoneProductSpecs';
import MiscProductSpecs from '../components/home/MiscProductSpecs';
import QuotationForm from '../components/products/QuotationForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import { 
  HiOutlineShoppingBag, 
  HiOutlineMail, 
  HiOutlineShieldCheck, 
  HiOutlineTruck,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineX,
  HiOutlineHome
} from 'react-icons/hi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { requiresQuotation } from '../utils/productHelpers';

const ProductDetailsSkeleton = () => (
  <div className="bg-white min-h-screen pt-24 md:pt-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        <div className="aspect-square bg-gray-100 rounded-[32px] md:rounded-[48px] animate-pulse"></div>
        <div className="space-y-6">
          <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-12 w-1/3 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 rounded-full animate-pulse"></div>
            <div className="h-4 w-full bg-gray-100 rounded-full animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cart } = useCart();

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const fromShop = location.state?.from === '/shop';
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/api/products/${slug}`);
      return response.data;
    },
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['product-related', slug],
    queryFn: async () => {
      const response = await api.get(`/api/products/${slug}/related?limit=4`);
      return response.data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <ProductDetailsSkeleton />;

  const isQuoteProduct = product ? requiresQuotation(product) : false;

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-2xl font-black text-gray-900 mb-4">Product Not Found</h2>
      <Link to="/shop" className="text-primary font-bold hover:underline">Return to Shop</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Mini Navigation (Since Header is hidden) */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest hover:text-primary transition-all group"
          >
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-primary/10 transition-colors">
              <HiOutlineChevronLeft size={18} />
            </div>
            {fromShop ? 'Back to Shop' : 'Back'}
          </button>
          <div className="flex items-center gap-6">
            <Link to="/" className="p-2 text-gray-400 hover:text-primary transition-colors" title="Home">
              <HiOutlineHome size={20} />
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-primary transition-colors" title="Cart">
              <HiOutlineShoppingBag size={20} />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    key={cartItemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <HiOutlineChevronRight />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <HiOutlineChevronRight />
            <Link to={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
            <HiOutlineChevronRight />
            <span className="text-primary">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4 md:space-y-6">
            <div className="relative aspect-square md:aspect-square rounded-[24px] md:rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <Swiper
                style={{
                  '--swiper-navigation-color': '#1E40AF',
                  '--swiper-pagination-color': '#1E40AF',
                }}
                spaceBetween={10}
                navigation={true}
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                className="w-full h-full"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img 
                      src={img} 
                      alt={product.name} 
                      loading="lazy"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover" 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            {/* Thumbnails */}
            <div className="px-2 md:px-4">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx} className="cursor-pointer">
                    <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 border-transparent swiper-slide-thumb-active:border-primary transition-all">
                      <img 
                        src={img} 
                        alt={product.name} 
                        loading="lazy"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="px-3 md:px-4 py-1 md:py-1.5 bg-primary-light text-primary rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-primary/10">
                  {product.brand} Professional
                </span>
                <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? '• In Stock' : '• Out of Stock'}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">Model: <span className="text-gray-900">{product.modelNumber}</span></p>
                <div className="w-px h-3 md:h-4 bg-gray-200"></div>
                <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">Category: <span className="text-gray-900">{product.category.name}</span></p>
              </div>

              {isQuoteProduct ? (
                <div className="mb-6 md:mb-10">
                  <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-sm font-black uppercase tracking-widest">
                    Price on Request — Submit Quotation Request
                  </span>
                </div>
              ) : (
                <div className="text-2xl md:text-4xl font-black text-primary mb-6 md:mb-10">
                  Rs {product.price.toLocaleString()}
                  <span className="text-[10px] md:text-xs text-gray-400 font-bold ml-2 uppercase tracking-tighter">Excl. VAT & Shipping</span>
                </div>
              )}

              <div className="space-y-8 mb-12">
                {/* Specialized Drone Specs (Full) */}
                {product.category.slug === 'drones-spare-parts' && (
                  <div className="mb-10">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Technical Specifications</h4>
                    <DroneProductSpecs specifications={product.specifications} variant="full" />
                  </div>
                )}

                {/* Specialized LMR Specs (Full Table & Compatibility) */}
                {product.category.slug === 'lmr-spare-parts' && (
                  <div className="mb-10">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Industrial Specifications</h4>
                    <LMRProductSpecs specifications={product.specifications} variant="full" />
                  </div>
                )}

                {/* Specialized Camera Specs (Full Details) */}
                {product.category.slug === 'camera-systems' && (
                  <div className="mb-10">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Surveillance Technical Details</h4>
                    <CameraProductSpecs specifications={product.specifications} variant="full" />
                  </div>
                )}

                {/* Specialized Telephone Specs (Full Details) */}
                {product.category.slug === 'telephones' && (
                  <div className="mb-10">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Telephone System Features</h4>
                    <TelephoneProductSpecs specifications={product.specifications} variant="full" />
                  </div>
                )}

                {/* Specialized Misc Specs (Full Details) */}
                {product.category.slug === 'miscellaneous' && (
                  <div className="mb-10">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Technical Component Data</h4>
                    <MiscProductSpecs specifications={product.specifications} variant="full" />
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Product Overview</h4>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Technical Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <HiOutlineShieldCheck className="text-primary text-2xl" />
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Warranty</p>
                      <p className="text-[10px] text-gray-500 font-bold">2-Year Professional</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <HiOutlineTruck className="text-primary text-2xl" />
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Delivery</p>
                      <p className="text-[10px] text-gray-500 font-bold">Fast Global Shipping</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isQuoteProduct ? (
                <div className="mb-8">
                  <button 
                    onClick={() => setShowQuoteModal(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-600/20 hover:bg-amber-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                  >
                    <HiOutlineMail size={22} />
                    Request Quotation
                  </button>
                  <p className="mt-3 text-xs text-gray-500 font-medium">Our team will review your request and send a custom quote. After approval, we will place your order and send a receipt.</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center font-black text-gray-500 hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-12 bg-transparent text-center font-black text-gray-900 focus:outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center font-black text-gray-500 hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-grow py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <HiOutlineShoppingBag size={24} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Specs & Related */}
        <div className="mt-16 space-y-24">
          
          {/* Specifications Table */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Technical Specifications</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full"></div>
            </div>
            
            <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <tbody>
                  {product.specifications && Object.entries(product.specifications).map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      {key.startsWith('line_') ? (
                        <td colSpan="2" className="px-8 py-6 text-sm font-bold text-gray-700">{value}</td>
                      ) : (
                        <>
                          <td className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest border-r border-gray-100 w-1/3">{key}</td>
                          <td className="px-8 py-6 text-sm font-bold text-gray-700">{value}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Related Accessories */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex justify-between items-end mb-8 md:mb-12">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Related Products</h2>
                  <div className="w-16 md:w-20 h-1 md:h-1.5 bg-primary rounded-full"></div>
                </div>
                <Link to={`/category/${product.category.slug}`} className="text-primary text-sm font-bold hover:underline">View All</Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                {relatedProducts.map((item, index) => (
                  <ProductCard 
                    key={item._id} 
                    product={item} 
                    index={index} 
                    category={item.category} 
                    addToCart={addToCart} 
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Sticky Mobile Add to Cart Bar */}
      {!isQuoteProduct && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center font-black text-gray-500"
              >
                -
              </button>
              <span className="w-8 flex items-center justify-center font-black text-gray-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center font-black text-gray-500"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-grow py-3.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Inquiry Button for Quote Products */}
      {isQuoteProduct && (
        <div className="md:hidden fixed bottom-6 right-6 z-[100]">
          <button 
            onClick={() => setShowQuoteModal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-amber-600 text-white font-black rounded-full shadow-2xl shadow-amber-600/30"
          >
            <HiOutlineMail size={20} />
            Request Quote
          </button>
        </div>
      )}

      <QuotationForm 
        product={product}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </div>
  );
};

export default ProductDetailsPage;
