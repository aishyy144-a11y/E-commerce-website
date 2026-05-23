import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const fromShop = location.state?.from === '/shop';
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 1500);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${slug}`);
        setProduct(response.data);
        
        // Fetch related products (same category)
        const relatedRes = await axios.get(`http://localhost:5000/api/products/category/${response.data.category.slug}`);
        setRelatedProducts(relatedRes.data.filter(p => p._id !== response.data._id));
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <Swiper
                style={{
                  '--swiper-navigation-color': '#1E40AF',
                  '--swiper-pagination-color': '#1E40AF',
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                className="w-full h-full"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img 
                      src={img} 
                      alt={product.name} 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover" 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            {/* Thumbnails */}
            <div className="px-4">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={15}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx} className="cursor-pointer">
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent swiper-slide-thumb-active:border-primary transition-all">
                      <img 
                        src={img} 
                        alt={product.name} 
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
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-primary-light text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                  {product.brand} Professional
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? '• In Stock' : '• Out of Stock'}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Model: <span className="text-gray-900">{product.modelNumber}</span></p>
                <div className="w-px h-4 bg-gray-200"></div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Category: <span className="text-gray-900">{product.category.name}</span></p>
              </div>

              <div className="text-4xl font-black text-primary mb-10">
                Rs {product.price.toLocaleString()}
                <span className="text-xs text-gray-400 font-bold ml-2 uppercase tracking-tighter">Excl. VAT & Shipping</span>
              </div>

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
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Related Accessories</h2>
                  <div className="w-20 h-1.5 bg-primary rounded-full"></div>
                </div>
                <Link to={`/category/${product.category.slug}`} className="text-primary font-bold hover:underline">View All</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(item => (
                  <Link 
                    key={item._id} 
                    to={`/product/${item.slug}`}
                    className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-50">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-xl font-black text-primary">Rs {item.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;
