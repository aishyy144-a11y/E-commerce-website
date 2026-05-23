import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import axios from 'axios';
import aboutImg from '../assets/about.png';
import { 
  HiOutlineShieldCheck, 
  HiOutlineDesktopComputer, 
  HiOutlineDeviceMobile, 
  HiOutlineLightningBolt,
  HiOutlineChip,
  HiOutlineStatusOnline,
  HiOutlinePrinter,
  HiOutlineDatabase,
  HiOutlineLightBulb,
  HiOutlineVolumeUp,
  HiOutlineLink,
  HiOutlinePuzzle,
  HiOutlineCog, 
  HiOutlineAdjustments, 
  HiOutlineCheckCircle, 
  HiOutlineArrowRight,
  HiOutlineCube
} from 'react-icons/hi';

const CategoryCard = ({ icon: Icon, title, items }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
  >
    <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-sm text-gray-500 font-medium leading-relaxed">{items}</p>
  </motion.div>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary">
      <HiOutlineCheckCircle size={16} />
    </div>
    <span className="text-gray-700 font-bold text-sm uppercase tracking-tight">{text}</span>
  </div>
);

const AboutPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="pt-28 md:pt-32">
      {/* Hero Section */}
      <section className="relative pt-8 pb-4 lg:pt-12 lg:pb-6 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                About Innovative Solutions
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tighter uppercase">
                Empowering the <span className="text-primary italic text-6xl md:text-8xl block">Digital World</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-6">
                At Innovative Solutions, we are committed to providing high-quality electronic products that meet the growing demands of today’s digital world. With a strong focus on reliability, affordability, and customer satisfaction, we have established ourselves as a trusted name in the electronics market.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-primary">5000+</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clients</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-primary">24/7</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-primary">100%</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Genuine</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="relative rounded-[60px] overflow-hidden aspect-[4/5] shadow-2xl">
                <img 
                  src={aboutImg} 
                  alt="About Innovative Solutions" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Range Section */}
      <section className="py-6 lg:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Our Product Range</h2>
            <p className="text-lg text-gray-500 font-medium">
              We deal in a wide range of electronic products, serving individuals, businesses, and educational institutions with tailored solutions that enhance productivity and efficiency.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, index) => (
              <CategoryCard 
                key={cat.slug}
                icon={HiOutlineCube} 
                title={cat.name} 
                items={cat.description} 
              />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 p-4 bg-white rounded-[20px] border border-gray-100 text-center shadow-sm"
          >
            <p className="text-sm text-gray-600 font-bold italic">
              "We continuously update our inventory to bring you the latest technologies and ensure you always have access to modern, efficient, and reliable products."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Why Choose Us */}
      <section className="py-6 lg:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Our Purpose</span>
                <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Our Mission</h2>
                <div className="p-10 bg-primary rounded-[40px] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                  <p className="text-2xl text-white font-black leading-tight relative z-10 italic">
                    "To deliver top-quality electronic products at competitive prices, while maintaining excellent customer service and building long-term relationships with our clients."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">The Advantage</span>
                <h2 className="text-4xl font-black text-gray-900 mb-10 uppercase tracking-tighter">Why Choose Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FeatureItem text="Wide range of products" />
                  <FeatureItem text="Competitive pricing" />
                  <FeatureItem text="Genuine & high-quality" />
                  <FeatureItem text="Customer-focused" />
                  <FeatureItem text="Fast & efficient service" />
                  <FeatureItem text="Innovation & trust" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
