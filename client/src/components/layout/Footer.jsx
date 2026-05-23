import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa6';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineLightBulb } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 overflow-hidden relative">
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <Link to="/" className="text-3xl font-black text-white flex items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center shadow-2xl shadow-blue-600/40 group-hover:rotate-12 transition-transform duration-500">
                <HiOutlineLightBulb className="text-white text-3xl" />
              </div>
              <span className="tracking-tighter">INNOVATIVE <span className="text-blue-500">SOLUTIONS</span></span>
            </Link>
            <p className="text-slate-400 leading-relaxed font-medium">
              Leading provider of innovative industrial solutions. Specializing in enterprise drone technology, 
              telecom infrastructure, and professional surveillance systems.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/innovativesolutions_official?igsh=MmdmOGJka213dHBv" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-500 border border-white/10 shadow-lg group/social">
                <FaInstagram size={20} className="group-hover/social:scale-110 transition-transform" />
              </a>
              <a href="https://wa.me/923117702133" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-500 border border-white/10 shadow-lg group/social">
                <FaWhatsapp size={20} className="group-hover/social:scale-110 transition-transform" />
              </a>
              <a href="https://www.tiktok.com/@my_innovative_solutions?_r=1&_t=ZS-96YDWed1yTs" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 border border-white/10 shadow-lg group/social">
                <FaTiktok size={20} className="group-hover/social:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-black text-white mb-10 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Contact Ops</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Civic+Center,+Township,+Lahore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0"
                >
                  <HiOutlineLocationMarker size={20} />
                </a>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">HQ Address</p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Civic+Center,+Township,+Lahore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 font-bold text-sm hover:text-blue-500 transition-colors"
                  >
                    Civic Center, Township, Lahore
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <a 
                  href="tel:03117702133" 
                  className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0"
                >
                  <HiOutlinePhone size={20} />
                </a>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Technical Support</p>
                  <a href="tel:03117702133" className="text-slate-300 font-bold text-sm hover:text-blue-500 transition-colors">03117702133</a>
                </div>
              </li>
              <li className="group">
                <a 
                  href="mailto:innovativesolutions.support.pk@gmail.com"
                  className="flex items-start gap-4 cursor-pointer relative z-10"
                >
                  <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                    <HiOutlineMail size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Sales & Inquiry</p>
                    <p className="text-slate-300 font-bold text-sm break-all group-hover:text-blue-500 transition-colors">
                      innovativesolutions.support.pk@gmail.com
                    </p>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Industrial Sectors */}
          <div>
            <h4 className="text-lg font-black text-white mb-10 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Industrial Sectors</h4>
            <ul className="grid grid-cols-1 gap-4">
              {[
                { name: 'Drone Technology', path: '/category/drones-spare-parts' },
                { name: 'Telecom Infrastructure', path: '/category/lmr-spare-parts' },
                { name: 'Surveillance Systems', path: '/category/camera-systems' },
                { name: 'Fiber Optic Tools', path: '/category/miscellaneous' },
                { name: 'Enterprise Radio', path: '/category/icom' },
                { name: 'IP Telephony', path: '/category/telephones' }
              ].map((sector) => (
                <li key={sector.name}>
                  <Link to={sector.path} className="text-slate-400 hover:text-blue-500 transition-colors font-bold text-sm flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
                    {sector.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Links */}
          <div>
            <h4 className="text-lg font-black text-white mb-10 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-blue-500 transition-colors font-bold text-sm block">
                  About the Company
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-slate-400 hover:text-blue-500 transition-colors font-bold text-sm block">
                  Track Your Order
                </Link>
              </li>
              {[
                'Technical Documentation',
                'Quotation Policy',
                'Bulk Orders',
                'Enterprise Support',
                'Authorized Brands',
                'Terms of Trade'
              ].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-slate-400 hover:text-blue-500 transition-colors font-bold text-sm block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 INNOVATIVE SOLUTIONS INDUSTRIAL. BUILT FOR PRECISION.
          </div>
          <div className="flex gap-8">
            <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Shield</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Usage Terms</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
