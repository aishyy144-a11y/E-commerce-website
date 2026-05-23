import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Hero from './components/home/Hero';
import StatsSection from './components/home/StatsSection';
import Categories from './components/home/Categories';
import Products from './components/home/Products';
import TrustedBrands from './components/home/TrustedBrands';
import Testimonials from './components/home/Testimonials';
import Newsletter from './components/home/Newsletter';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import IndustrialProductsPage from './pages/IndustrialProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TrackOrder from './pages/TrackOrder';
import WishlistPage from './pages/WishlistPage';
import UserDashboard from './pages/user/UserDashboard.jsx';
import UserOrders from './pages/user/UserOrders.jsx';
import UserProfile from './pages/user/UserProfile.jsx';
import UserSettings from './pages/user/UserSettings.jsx';

// Admin PagesImports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminBulkUpload from './pages/admin/AdminBulkUpload';
import AdminQuotations from './pages/admin/AdminQuotations';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/login" state={{ from: location.pathname }} />;
  
  return children;
};

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProductDetailRoute = location.pathname.startsWith('/product/');
  const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/reset-password/');
  const isHome = location.pathname === '/';

  const shouldHideLayout = isAdminRoute || isProductDetailRoute || isAuthRoute;

  return (
    <div className={`flex flex-col min-h-screen ${isAuthRoute ? 'overflow-hidden h-screen' : ''}`}>
      {!shouldHideLayout && <Navbar />}
      <div className="flex-grow">
        {children}
      </div>
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

const Home = () => {
  return (
    <main className="overflow-x-hidden pt-28 md:pt-32">
      <Hero />
      <StatsSection />
      <div id="categories-section">
        <Categories />
      </div>
      <Products />
      <Newsletter />
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <ConditionalLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:slug" element={<CategoryProductsPage />} />
              <Route path="/shop" element={<IndustrialProductsPage />} />
              <Route path="/product/:slug" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* User Routes */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<UserSettings />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="bulk" element={<AdminBulkUpload />} />
                <Route path="quotations" element={<AdminQuotations />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>
            </Routes>
          </ConditionalLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
