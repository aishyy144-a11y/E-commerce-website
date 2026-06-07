import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineX, 
  HiOutlineTrash, 
  HiOutlineDownload, 
  HiOutlineMail, 
  HiOutlineSearch,
  HiOutlineDocumentText
} from 'react-icons/hi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const GenerateQuotationModal = ({ inquiry, isOpen, onClose }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const [quoteMeta, setQuoteMeta] = useState({
    quoteNumber: '',
    date: '',
    validity: '15 Days'
  });

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Financial values
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [notes, setNotes] = useState(
    "1. Prices are subject to change without prior notice.\n2. Delivery Time: 3-5 working days after receipt of purchase order.\n3. Payment Terms: 50% advance payment, 50% upon successful delivery."
  );

  const [sendingEmail, setSendingEmail] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Initialize form when inquiry changes
  useEffect(() => {
    if (inquiry) {
      setCustomerInfo({
        name: inquiry.name || '',
        email: inquiry.email || '',
        phone: inquiry.phone || '',
        company: inquiry.company || ''
      });

      // Generate a unique quote number
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      setQuoteMeta({
        quoteNumber: `QT-${year}-${randomId}`,
        date: new Date().toISOString().split('T')[0],
        validity: '15 Days'
      });

      // Pre-fill items from inquiry products (auto-fetched from DB)
      if (inquiry.products && inquiry.products.length > 0) {
        setItems(inquiry.products.map(p => ({
          id: p._id || Date.now(),
          name: p.name || '',
          description: p.description || 'Requested product quote',
          price: p.price || 0,
          quantity: inquiry.quantity || 1
        })));
      } else if (inquiry.product) {
        setItems([
          {
            id: inquiry.product._id || Date.now(),
            name: inquiry.product.name || '',
            description: inquiry.product.description || 'Requested product quote',
            price: inquiry.product.price || 0,
            quantity: inquiry.quantity || 1
          }
        ]);
      } else {
        setItems([]);
      }
    }
  }, [inquiry]);

  // Handle product search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setSearching(true);
        try {
          const response = await api.get(`/api/products/search?query=${searchQuery}`);
          setSearchResults(response.data);
        } catch (err) {
          console.error('Error searching products:', err);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!isOpen || !inquiry) return null;

  // Add selected search product to items
  const handleAddProduct = (product) => {
    // Check if product is already in items
    const exists = items.some(item => item.id === product._id);
    if (exists) {
      toast.info('Product is already in the quotation list');
      setSearchQuery('');
      setSearchResults([]);
      return;
    }

    setItems([
      ...items,
      {
        id: product._id,
        name: product.name,
        description: product.description || '',
        price: product.price || 0,
        quantity: 1
      }
    ]);
    setSearchQuery('');
    setSearchResults([]);
    toast.success(`${product.name} added`);
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Financial Calculations
  const getSubtotal = () => {
    return items.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1), 0);
  };

  const getTaxAmount = (subtotal) => {
    const taxableAmount = Math.max(0, subtotal - (parseFloat(discount) || 0));
    return taxableAmount * ((parseFloat(taxRate) || 0) / 100);
  };

  const getGrandTotal = () => {
    const sub = getSubtotal();
    const disc = parseFloat(discount) || 0;
    const tax = getTaxAmount(sub);
    const ship = parseFloat(shipping) || 0;
    return Math.max(0, sub - disc + tax + ship);
  };

  // Generate HTML Content
  const generateHTMLContent = () => {
    const subtotal = getSubtotal();
    const tax = getTaxAmount(subtotal);
    const total = getGrandTotal();

    const itemsHTML = items.map((item, index) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; vertical-align: top; text-align: center;">${index + 1}</td>
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; font-weight: 600; vertical-align: top;">
          ${item.name}
        </td>
        <td style="padding: 12px 16px; font-size: 13px; color: #64748b; vertical-align: top; white-space: pre-line;">${item.description}</td>
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; text-align: right; vertical-align: top;">Rs ${parseFloat(item.price).toLocaleString()}</td>
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; text-align: center; vertical-align: top;">${item.quantity}</td>
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; text-align: right; font-weight: 600; vertical-align: top;">Rs ${(parseFloat(item.price) * parseInt(item.quantity)).toLocaleString()}</td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quotation ${quoteMeta.quoteNumber}</title>
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 850px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 25px;
      margin-bottom: 30px;
    }
    .company-logo {
      background-color: #1e40af;
      color: #ffffff;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
      margin-bottom: 10px;
    }
    .company-name {
      font-size: 20px;
      font-weight: 800;
      color: #1e40af;
      margin: 0;
    }
    .company-tagline {
      font-size: 11px;
      color: #64748b;
      margin: 2px 0 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .quote-title {
      font-size: 28px;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      text-align: right;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    .meta-box {
      background-color: #f8fafc;
      padding: 20px;
      border-radius: 16px;
      border: 1px solid #f1f5f9;
    }
    .meta-title {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 0;
      margin-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    .meta-value {
      font-size: 14px;
      line-height: 1.6;
      margin: 4px 0;
    }
    .meta-label {
      font-weight: 600;
      color: #475569;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background-color: #1e40af;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 12px 16px;
      text-align: left;
    }
    th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
    th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
    .summary-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    .summary-table {
      width: 300px;
      margin-bottom: 0;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .summary-row-bold {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 18px;
      font-weight: 800;
      color: #1e40af;
      border-top: 2px solid #e2e8f0;
      margin-top: 8px;
    }
    .terms-box {
      background-color: #f8fafc;
      border-left: 4px solid #1e40af;
      padding: 20px;
      border-radius: 0 16px 16px 0;
      font-size: 13px;
      line-height: 1.6;
      color: #475569;
    }
    .terms-title {
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 8px;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    .footer-highlight {
      color: #1e40af;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }
      .container {
        box-shadow: none;
        border: none;
        padding: 0;
      }
      th {
        background-color: #1e40af !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="company-logo">IS</div>
        <h1 class="company-name">Innovative Solutions</h1>
        <p class="company-tagline">Industrial Excellence</p>
      </div>
      <div>
        <h2 class="quote-title">Quotation</h2>
        <div style="text-align: right; margin-top: 10px; font-size: 14px; line-height: 1.6;">
          <p style="margin: 2px 0;"><strong>Quotation #:</strong> ${quoteMeta.quoteNumber}</p>
          <p style="margin: 2px 0;"><strong>Date:</strong> ${new Date(quoteMeta.date).toLocaleDateString()}</p>
          <p style="margin: 2px 0;"><strong>Validity:</strong> ${quoteMeta.validity}</p>
        </div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-box">
        <h3 class="meta-title">Prepared By</h3>
        <p class="meta-value"><strong>Innovative Solutions Support</strong></p>
        <p class="meta-value"><span class="meta-label">Phone:</span> +92 311 7702133</p>
        <p class="meta-value"><span class="meta-label">Email:</span> innovativesolutions.support.pk@gmail.com</p>
        <p class="meta-value"><span class="meta-label">Web:</span> www.innovativesolutions.pk</p>
      </div>
      <div class="meta-box">
        <h3 class="meta-title">Prepared For</h3>
        <p class="meta-value"><strong>Customer Name:</strong> ${customerInfo.name}</p>
        ${customerInfo.company ? `<p class="meta-value"><span class="meta-label">Company:</span> ${customerInfo.company}</p>` : ''}
        <p class="meta-value"><span class="meta-label">Phone:</span> ${customerInfo.phone}</p>
        <p class="meta-value"><span class="meta-label">Email:</span> ${customerInfo.email}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50px; text-align: center;">#</th>
          <th style="text-align: left;">Product</th>
          <th style="text-align: left; width: 40%;">Description</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: center; width: 80px;">Qty</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div class="summary-container">
      <div class="summary-table">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>Rs ${subtotal.toLocaleString()}</span>
        </div>
        ${discount > 0 ? `
        <div class="summary-row" style="color: #dc2626;">
          <span>Discount:</span>
          <span>- Rs ${parseFloat(discount).toLocaleString()}</span>
        </div>
        ` : ''}
        ${taxRate > 0 ? `
        <div class="summary-row">
          <span>Sales Tax (${taxRate}%):</span>
          <span>Rs ${tax.toLocaleString()}</span>
        </div>
        ` : ''}
        ${shipping > 0 ? `
        <div class="summary-row">
          <span>Shipping/Delivery:</span>
          <span>Rs ${parseFloat(shipping).toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="summary-row-bold">
          <span>Grand Total:</span>
          <span>Rs ${total.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div class="terms-box">
      <h3 class="terms-title">Terms & Conditions</h3>
      <div style="white-space: pre-line;">${notes}</div>
    </div>

    <div class="footer">
      <p class="footer-highlight">Innovative Solutions - Industrial Excellence</p>
      <p style="margin: 0;">Thank you for your interest in our products and services. We look forward to working together.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const getPdfFileName = () =>
    `${quoteMeta.quoteNumber}_Quotation_${customerInfo.name.replace(/\s+/g, '_')}.pdf`;

  const generatePDFBlob = async () => {
    const htmlContent = generateHTMLContent();
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:850px;height:1200px;border:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const canvas = await html2canvas(doc.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 850
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf.output('blob');
    } finally {
      document.body.removeChild(iframe);
    }
  };

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (items.length === 0) {
      toast.error('Cannot generate empty quotation. Please add items.');
      return;
    }
    setGeneratingPdf(true);
    try {
      const blob = await generatePDFBlob();
      downloadBlob(blob, getPdfFileName());
      toast.success('PDF quotation downloaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Send Email via Backend
  const handleSendEmail = async () => {
    if (items.length === 0) {
      toast.error('Cannot generate empty quotation. Please add items.');
      return;
    }
    setSendingEmail(true);
    const htmlContent = generateHTMLContent();

    try {
      const response = await api.post('/api/inquiries/send-quotation-email', {
        email: customerInfo.email,
        subject: `Commercial Quotation - ${quoteMeta.quoteNumber} - Innovative Solutions`,
        htmlContent: htmlContent
      });
      toast.success(response.data.message || 'Quotation email sent successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send quotation email. Ensure EMAIL_PASS is set.');
    } finally {
      setSendingEmail(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/70 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
              <HiOutlineDocumentText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Generate Quotation</h2>
              <p className="text-xs text-gray-500 font-medium">Create and send customized corporate quotation sheets.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-gray-100 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all border border-gray-200"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Metadata & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Details Box */}
            <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Client Name</label>
                  <input 
                    type="text" 
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Company Name</label>
                  <input 
                    type="text" 
                    value={customerInfo.company}
                    onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Quote Metadata Box */}
            <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Quotation Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Quote Number</label>
                  <input 
                    type="text" 
                    value={quoteMeta.quoteNumber}
                    onChange={(e) => setQuoteMeta({...quoteMeta, quoteNumber: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Issue Date</label>
                  <input 
                    type="date" 
                    value={quoteMeta.date}
                    onChange={(e) => setQuoteMeta({...quoteMeta, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Validity Period</label>
                  <input 
                    type="text" 
                    value={quoteMeta.validity}
                    onChange={(e) => setQuoteMeta({...quoteMeta, validity: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-xs"
                    placeholder="e.g. 15 Days"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Search */}
          <div className="space-y-4 relative">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Products / Line Items</h3>

            {/* Interactive Search Bar */}
            <div className="relative">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search catalogue to add products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-700 text-sm"
                />
                <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                {searching && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-20 w-full left-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                  {searchResults.map(prod => (
                    <div 
                      key={prod._id}
                      onClick={() => handleAddProduct(prod)}
                      className="p-4 hover:bg-primary-light/50 cursor-pointer transition-colors flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">{prod.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Model: {prod.modelNumber || 'N/A'} | Brand: {prod.brand || 'N/A'}</p>
                      </div>
                      <span className="font-black text-primary text-sm">Rs {prod.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table/List */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold text-sm">No items in quotation. Search above to add items.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="p-6 bg-white border border-gray-200 rounded-[24px] shadow-sm relative group hover:shadow-md transition-shadow">
                    <button 
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Item"
                    >
                      <HiOutlineTrash size={18} />
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pr-8">
                      {/* Index & Product Title */}
                      <div className="lg:col-span-4 space-y-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item #${index + 1} Name</span>
                        <input 
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary font-bold text-gray-800 text-xs"
                        />
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-4 space-y-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description / Technical Specs</span>
                        <textarea 
                          rows="2"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary font-medium text-gray-600 text-xs"
                        />
                      </div>

                      {/* Price */}
                      <div className="lg:col-span-2 space-y-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Price (Rs)</span>
                        <input 
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary font-bold text-gray-800 text-xs"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="lg:col-span-1 space-y-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</span>
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary font-bold text-gray-800 text-xs text-center"
                        />
                      </div>

                      {/* Total */}
                      <div className="lg:col-span-1 space-y-1 text-right">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Subtotal</span>
                        <span className="font-black text-gray-900 text-sm block pt-2">
                          Rs {((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Adjustments & Note Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
            {/* Notes & Terms */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Terms & Conditions / Footer Notes</label>
                <textarea 
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium text-gray-600 text-xs leading-relaxed"
                  placeholder="Terms details..."
                />
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="lg:col-span-5 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <span>Items Subtotal:</span>
                  <span className="text-gray-900 font-black">Rs {getSubtotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Discount (Rs):</span>
                  <input 
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-28 px-3 py-1 bg-white border border-gray-200 rounded-lg text-right font-bold text-gray-700 text-xs"
                  />
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sales Tax (%):</span>
                  <input 
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-28 px-3 py-1 bg-white border border-gray-200 rounded-lg text-right font-bold text-gray-700 text-xs"
                  />
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Shipping/Delivery (Rs):</span>
                  <input 
                    type="number"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    className="w-28 px-3 py-1 bg-white border border-gray-200 rounded-lg text-right font-bold text-gray-700 text-xs"
                  />
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Grand Total:</span>
                  <span className="text-lg font-black text-primary">Rs {getGrandTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 border border-gray-200 hover:bg-gray-100 rounded-2xl font-bold text-gray-600 text-sm transition-colors"
          >
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Send via Email */}
            <button 
              type="button"
              disabled={sendingEmail}
              onClick={handleSendEmail}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/10 disabled:opacity-50 transition-all text-xs uppercase tracking-widest"
            >
              <HiOutlineMail size={16} />
              {sendingEmail ? 'Sending Email...' : 'Send Quotation Email'}
            </button>

            {/* Download PDF */}
            <button 
              type="button"
              disabled={generatingPdf}
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-lg shadow-primary/10 disabled:opacity-50 transition-all text-xs uppercase tracking-widest"
            >
              <HiOutlineDownload size={16} />
              {generatingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default GenerateQuotationModal;
