const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const Order = require('../models/Order');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');
const { protect, optionalProtect, admin } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const authRoutes = require('./auth');
const sendEmail = require('../utils/sendEmail');
console.log('Mounting auth routes in api.js');

// Auth routes
router.use('/auth', authRoutes);

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products with optional limit
router.get('/products/all', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    // Optimize: Select only necessary fields for product cards
    const products = await Product.find()
      .select('name slug modelNumber brand price category images specifications requiresQuote stock createdAt')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Product
router.post('/products', protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Product
router.put('/products/:id', protect, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Product
router.delete('/products/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk Upload Products
router.post('/products/bulk', protect, admin, async (req, res) => {
  try {
    const products = req.body; // Expecting an array of products
    const newProducts = await Product.insertMany(products);
    res.status(201).json(newProducts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Category CRUD
router.post('/categories', protect, admin, async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/categories/:id', protect, admin, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/categories/:id', protect, admin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search products
router.get('/products/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const searchRegex = new RegExp(query, 'i');
    
    // 1. Find categories that match the search query
    const matchedCategories = await Category.find({
      $or: [
        { name: searchRegex },
        { slug: searchRegex }
      ]
    }).select('_id');
    const categoryIds = matchedCategories.map(cat => cat._id);

    // 2. Search in products (including matched category IDs)
    // Optimize: Use projection to return only needed fields
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { modelNumber: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { category: { $in: categoryIds } }
      ]
    })
    .select('name slug modelNumber brand price category images specifications requiresQuote stock')
    .populate('category', 'name slug')
    .limit(20);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products by category slug
router.get('/products/category/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).select('_id name slug');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    // Optimize: Select only necessary fields
    const products = await Product.find({ category: category._id })
      .select('name slug modelNumber brand price category images specifications requiresQuote stock subCategory createdAt')
      .populate('category', 'name slug');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by slug
router.get('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('accessories');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Inquiry Routes ---

// Submit a new inquiry
router.post('/inquiries', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    const savedInquiry = await (await inquiry.save()).populate('product', 'name modelNumber brand slug');

    // 1. Send email notification to ADMIN
    try {
      const productInfo = savedInquiry.product 
        ? `<div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">Product Details:</h3>
            <p><strong>Product:</strong> ${savedInquiry.product.name}</p>
            <p><strong>Model:</strong> ${savedInquiry.product.modelNumber}</p>
            <p><strong>Brand:</strong> ${savedInquiry.product.brand}</p>
          </div>`
        : `<div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">General Inquiry:</h3>
            <p><strong>Subject:</strong> ${savedInquiry.subject || 'No Subject'}</p>
          </div>`;

      await sendEmail({
        email: process.env.ADMIN_EMAIL || 'innovativesolutions.support.pk@gmail.com',
        subject: `New ${savedInquiry.product ? 'Quotation' : 'General'} Request - ${savedInquiry.name}`,
        message: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; text-align: center;">New Inquiry Received</h2>
            
            ${productInfo}

            <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">Customer Information:</h3>
              <p><strong>Name:</strong> ${savedInquiry.name}</p>
              <p><strong>Email:</strong> ${savedInquiry.email}</p>
              <p><strong>Phone:</strong> ${savedInquiry.phone}</p>
              <p><strong>Company:</strong> ${savedInquiry.company || 'N/A'}</p>
              ${savedInquiry.quantity ? `<p><strong>Requested Qty:</strong> ${savedInquiry.quantity}</p>` : ''}
            </div>

            <h3 style="color: #475569; font-size: 16px;">Customer Message:</h3>
            <p style="background: #f1f5f9; border-left: 4px solid #2563eb; padding: 15px; font-style: italic; border-radius: 4px;">${savedInquiry.message}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/quotations" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View in Dashboard</a>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Admin Inquiry email notification failed:', emailErr);
    }

    // 2. Send confirmation email to USER
    try {
      const userProductInfo = savedInquiry.product 
        ? `<div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Inquiry Summary:</h3>
            <p style="margin: 5px 0;"><strong>Product:</strong> ${savedInquiry.product.name}</p>
            <p style="margin: 5px 0;"><strong>Quantity:</strong> ${savedInquiry.quantity}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">Pending Review</span></p>
          </div>`
        : `<div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Inquiry Summary:</h3>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${savedInquiry.subject || 'General Support'}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">Pending Review</span></p>
          </div>`;

      await sendEmail({
        email: savedInquiry.email,
        subject: `Inquiry Received - Innovative Solutions`,
        message: `
          <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 20px;">
                <tr>
                  <td align="center" valign="middle" style="background: #2563eb; width: 64px; height: 64px; border-radius: 16px; color: #ffffff; font-weight: 900; font-size: 24px;">
                    IS
                  </td>
                </tr>
              </table>
              <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 800;">Thank You for Reaching Out!</h2>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${savedInquiry.name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">We have received your ${savedInquiry.product ? 'quotation request' : 'message'}. Our technical team is reviewing your requirements and will contact you shortly. 📩</p>
            
            ${userProductInfo}

            <div style="background: #f1f5f9; padding: 20px; border-radius: 16px; text-align: center; margin-top: 30px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Need an immediate response?</p>
              <a href="https://wa.me/923117702133" style="display: inline-block; margin-top: 10px; color: #2563eb; font-weight: 800; text-decoration: none; font-size: 16px;">Chat on WhatsApp 0311-7702133</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated confirmation. Please do not reply to this email directly.</p>
            <p style="font-size: 12px; color: #2563eb; text-align: center; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Innovative Solutions - Industrial Excellence</p>
          </div>
        `
      });
    } catch (userEmailErr) {
      console.error('User Inquiry confirmation email failed:', userEmailErr);
    }

    res.status(201).json(savedInquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all inquiries (Admin only)
router.get('/inquiries', protect, admin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('product', 'name modelNumber brand slug')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update inquiry status/notes (Admin only)
router.put('/inquiries/:id', protect, admin, async (req, res) => {
  try {
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('product', 'name modelNumber brand slug');
    res.json(updatedInquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete inquiry (Admin only)
router.delete('/inquiries/:id', protect, admin, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Newsletter Routes ---

// Subscribe to newsletter
router.post('/newsletter/subscribe', async (req, res) => {
  console.log('Newsletter subscription attempt:', req.body.email);
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === 'active') {
        return res.status(400).json({ message: 'You are already subscribed!' });
      } else {
        existing.status = 'active';
        await existing.save();
        return res.json({ message: 'Welcome back! Your subscription is active again.' });
      }
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send welcome email
    try {
      await sendEmail({
        email: email,
        subject: 'Welcome to Innovative Solutions Newsletter',
        message: `
          <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 20px;">
              <tr>
                <td align="center" valign="middle" style="background: #2563eb; width: 64px; height: 64px; border-radius: 16px; color: #ffffff; font-weight: 900; font-size: 24px;">
                  IS
                </td>
              </tr>
            </table>
            <h2 style="color: #2563eb; font-size: 24px; font-weight: 800; margin: 0 0 15px 0;">Thanks for Subscribing! 🎉</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">You'll now receive our latest industrial updates, technical insights, and exclusive enterprise offers directly in your inbox.</p>
            <div style="margin: 30px 0; padding: 25px; background: #f1f5f9; border-radius: 20px;">
              <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Stay Connected</p>
              <div style="margin-top: 15px;">
                <a href="https://www.instagram.com/innovativesolutions_official" style="display: inline-block; background: #E1306C; color: #ffffff; padding: 10px 20px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px;">Follow on Instagram</a>
              </div>
            </div>
            <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Innovative Solutions - Industrial Excellence</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Welcome email failed:', e);
    }

    res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all subscribers (Admin only)
router.get('/newsletter/subscribers', protect, admin, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send bulk promotion email (Admin only)
router.post('/newsletter/send-bulk', protect, admin, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ message: 'Subject and message are required' });

    const subscribers = await Subscriber.find({ status: 'active' });
    const emails = subscribers.map(s => s.email);

    if (emails.length === 0) return res.status(400).json({ message: 'No active subscribers found' });

    // Send emails in background (using BCC for efficiency in simple cases)
    // For production, a queue system like Bull or a service like Mailchimp is better
    try {
      await sendEmail({
        email: emails.join(','), // Multiple recipients
        subject: subject,
        message: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            ${message}
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">
              You received this email because you're subscribed to Innovative Solutions. 
              <br/>To unsubscribe, please contact support.
            </p>
          </div>
        `
      });
      res.json({ message: `Promotion email sent to ${emails.length} subscribers!` });
    } catch (err) {
      console.error('Bulk email failed:', err);
      res.status(500).json({ message: 'Failed to send bulk emails' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Public Stats ---
router.get('/public/stats', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    res.json({
      products: productCount,
      categories: categoryCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Admin Dashboard Stats ---
router.get('/admin/stats', protect, admin, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const orderCount = await Order.countDocuments();
    const subscriberCount = await Subscriber.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      products: productCount,
      categories: categoryCount,
      orders: orderCount,
      subscribers: subscriberCount,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear All Data (DANGEROUS - Admin Only)
router.post('/admin/clear-database', protect, admin, async (req, res) => {
  try {
    await Product.deleteMany({});
    await Category.deleteMany({});
    res.json({ message: 'Database cleared successfully (Categories & Products removed)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- User Routes ---

// Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Order Routes ---

// Create new order
router.post('/orders', optionalProtect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      guestInfo
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user ? req.user._id : undefined,
      guestInfo: !req.user ? guestInfo : undefined,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending' // Explicitly set status to avoid validation issues
    });

    const createdOrder = await order.save();

    // Send email to admin
    try {
      const customerName = req.user ? req.user.name : guestInfo?.name || 'Guest';
      const customerEmail = req.user ? req.user.email : guestInfo?.email || 'N/A';

      await sendEmail({
        email: 'innovativesolutions.support.pk@gmail.com',
        subject: `🚨 NEW ORDER ALERT - #${createdOrder.orderNumber || createdOrder._id.toString().slice(-8).toUpperCase()}`,
        message: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background-color: #f8fafc; max-width: 850px; margin: auto;">
            <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
              <!-- Professional Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 20px;">
                  <tr>
                    <td align="center" valign="middle" style="background: #2563eb; width: 64px; height: 64px; border-radius: 16px; color: #ffffff; font-weight: 900; font-size: 24px;">
                      IS
                    </td>
                  </tr>
                </table>
                <h1 style="margin-top: 10px; color: #0f172a; font-size: 26px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">New Order Received 📦</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Placed on ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</p>
              </div>

              <!-- Order ID & Status -->
              <div style="background: #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 30px; display: table; width: 100%; box-sizing: border-box;">
                <div style="display: table-cell; vertical-align: middle;">
                  <span style="color: #64748b; font-size: 11px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 4px;">Order ID</span>
                  <span style="font-weight: 900; color: #2563eb; font-size: 18px;">#${createdOrder.orderNumber || createdOrder._id.toString().slice(-8).toUpperCase()}</span>
                </div>
                <div style="display: table-cell; vertical-align: middle; text-align: right;">
                  <span style="color: #64748b; font-size: 11px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 4px;">Status</span>
                  <span style="font-weight: 900; color: #059669; background: #ecfdf5; padding: 6px 12px; border-radius: 10px; font-size: 12px;">PENDING</span>
                </div>
              </div>

              <div style="display: table; width: 100%; border-collapse: separate; border-spacing: 0 20px;">
                <!-- Customer & Shipping Section -->
                <div style="display: table-row;">
                  <div style="display: table-cell; width: 50%; padding-right: 15px; vertical-align: top;">
                    <h3 style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 10px;">Customer Details</h3>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; height: 120px;">
                      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Name:</strong> ${customerName}</p>
                      <p style="margin: 0 0 8px 0; font-size: 14px; word-break: break-all;"><strong>Email:</strong> ${customerEmail}</p>
                      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Phone:</strong> ${shippingAddress.phone}</p>
                      <p style="margin: 0; font-size: 14px;"><strong>Account:</strong> ${req.user ? 'Registered' : 'Guest'}</p>
                    </div>
                  </div>
                  <div style="display: table-cell; width: 50%; padding-left: 15px; vertical-align: top;">
                    <h3 style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 10px;">Shipping Address</h3>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; height: 120px;">
                      <p style="margin: 0; line-height: 1.6; font-size: 14px;">
                        ${shippingAddress.address}<br />
                        ${shippingAddress.city}, ${shippingAddress.postalCode}<br />
                        ${shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Items Table -->
              <div style="margin-top: 10px; margin-bottom: 30px;">
                <h3 style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 10px;">Inventory Details</h3>
                <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
                  <thead>
                    <tr>
                      <th style="text-align: left; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; padding: 12px 10px; border-bottom: 2px solid #f1f5f9;">Product</th>
                      <th style="text-align: center; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; padding: 12px 10px; border-bottom: 2px solid #f1f5f9;">Qty</th>
                      <th style="text-align: right; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; padding: 12px 10px; border-bottom: 2px solid #f1f5f9;">Unit Price</th>
                      <th style="text-align: right; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; padding: 12px 10px; border-bottom: 2px solid #f1f5f9;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItems.map(item => `
                      <tr>
                        <td style="padding: 15px 10px; border-bottom: 1px solid #f1f5f9;">
                          <div style="display: table;">
                            <div style="display: table-cell; vertical-align: middle;">
                              <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;">
                            </div>
                            <div style="display: table-cell; vertical-align: middle; padding-left: 12px;">
                              <span style="font-weight: 700; color: #1e293b; font-size: 14px; display: block;">${item.name}</span>
                            </div>
                          </div>
                        </td>
                        <td style="padding: 15px 10px; text-align: center; font-weight: 800; color: #64748b; border-bottom: 1px solid #f1f5f9;">x${item.quantity}</td>
                        <td style="padding: 15px 10px; text-align: right; font-weight: 700; color: #475569; border-bottom: 1px solid #f1f5f9;">Rs ${item.price.toLocaleString()}</td>
                        <td style="padding: 15px 10px; text-align: right; font-weight: 900; color: #0f172a; border-bottom: 1px solid #f1f5f9;">Rs ${(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Payment & Totals Summary -->
              <div style="background: #0f172a; padding: 35px; border-radius: 24px; color: white;">
                <div style="display: table; width: 100%;">
                  <div style="display: table-cell; width: 50%; vertical-align: top;">
                    <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Payment Method</span>
                    <span style="font-weight: 900; color: #3b82f6; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">${paymentMethod}</span>
                    <div style="margin-top: 15px; display: inline-block; background: rgba(59, 130, 246, 0.1); padding: 5px 12px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
                      <span style="font-size: 11px; color: #3b82f6; font-weight: 900;">UNPAID</span>
                    </div>
                  </div>
                  <div style="display: table-cell; width: 50%; vertical-align: top;">
                    <div style="display: table; width: 100%; border-collapse: separate; border-spacing: 0 10px;">
                      <div style="display: table-row;">
                        <div style="display: table-cell; text-align: left; font-size: 12px; color: #94a3b8;">Subtotal:</div>
                        <div style="display: table-cell; text-align: right; font-weight: 700;">Rs ${itemsPrice.toLocaleString()}</div>
                      </div>
                      <div style="display: table-row;">
                        <div style="display: table-cell; text-align: left; font-size: 12px; color: #94a3b8;">Shipping:</div>
                        <div style="display: table-cell; text-align: right; font-weight: 700;">Rs ${shippingPrice.toLocaleString()}</div>
                      </div>
                      ${taxPrice > 0 ? `
                      <div style="display: table-row;">
                        <div style="display: table-cell; text-align: left; font-size: 12px; color: #94a3b8;">Tax:</div>
                        <div style="display: table-cell; text-align: right; font-weight: 700;">Rs ${taxPrice.toLocaleString()}</div>
                      </div>
                      ` : ''}
                      <div style="display: table-row;">
                        <div style="display: table-cell; text-align: left; padding-top: 15px; border-top: 1px solid #334155; font-weight: 900; font-size: 14px; text-transform: uppercase;">Total:</div>
                        <div style="display: table-cell; text-align: right; padding-top: 15px; border-top: 1px solid #334155; font-size: 24px; font-weight: 900; color: #3b82f6;">Rs ${totalPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px;">
                <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; line-height: 1.8;">
                  This is an automated industrial order notification.<br/>
                  Manage this order in the <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/orders" style="color: #2563eb; text-decoration: none; font-weight: bold;">Admin Dashboard</a>.
                </p>
              </div>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr);
    }

    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get logged in user orders
router.get('/orders/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order by ID
router.get('/orders/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Track Order by Tracking ID or Order ID (Public)
router.get('/orders/track/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const cleanQuery = query.trim().toUpperCase();
    console.log('Tracking request for:', cleanQuery);
    
    // 1. Try finding by orderNumber first (IS001...)
    let order = await Order.findOne({ orderNumber: cleanQuery }).populate('user', 'name');

    // 2. Try finding by Tracking ID (Case-insensitive)
    if (!order) {
      order = await Order.findOne({ 
        trackingId: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } 
      }).populate('user', 'name');
    }
    
    // 3. If not found, and query is a valid MongoDB ID, try finding by _id
    if (!order && cleanQuery.match(/^[0-9A-F]{24}$/)) {
      order = await Order.findById(cleanQuery.toLowerCase()).populate('user', 'name');
    }

    // 4. Try finding by the LAST 8 digits of MongoDB ID (Short ID)
    if (!order && cleanQuery.length === 8) {
      const allOrders = await Order.find().populate('user', 'name');
      order = allOrders.find(o => o._id.toString().slice(-8).toUpperCase() === cleanQuery);
    }

    if (order) {
      console.log('Order found and sending to frontend:', {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      });
      
      // Explicitly construct response to ensure fields are present
      const responseData = {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status || 'Pending',
        trackingId: order.trackingId || '',
        orderItems: order.orderItems || [],
        totalPrice: order.totalPrice || 0,
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
        user: order.user,
        guestInfo: order.guestInfo
      };
      console.log('Sending structured data:', JSON.stringify(responseData, null, 2));
      return res.json(responseData);
    } else {
      console.log('Order not found for query:', cleanQuery);
      res.status(404).json({ message: 'Order not found. Please check your Order Number or Tracking ID.' });
    }
  } catch (err) {
    console.error('Tracking Error:', err);
    res.status(500).json({ message: 'Server error while tracking order' });
  }
});

// Get all orders (Admin only)
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (Admin only)
router.put('/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, trackingId } = req.body;
    const order = await Order.findById(req.params.id).populate('user');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    if (trackingId) order.trackingId = trackingId;
    
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Send email to customer if status is updated to Confirmed, Processing, Shipped or Delivered
    if (['Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(status)) {
      const customerEmail = order.user ? order.user.email : order.guestInfo?.email;
      const customerName = order.user ? order.user.name : order.guestInfo?.name || 'Customer';

      if (customerEmail) {
        let statusTitle = 'Order Update';
        let statusMessage = 'Your order status has been updated.';
        
        if (status === 'Confirmed') {
          statusTitle = 'Order Confirmed! ✅';
          statusMessage = 'Great news! Your order has been confirmed and is now being prepared for processing. We will notify you once it is dispatched.';
        } else if (status === 'Processing') {
          statusTitle = 'Order Processing ⚙️';
          statusMessage = 'Your order is currently being processed by our technical team. We are ensuring everything is perfect before shipping.';
        } else if (status === 'Shipped') {
          statusTitle = 'Order Shipped! 🚚';
          statusMessage = `Great news! Your order has been dispatched and is on its way. ${trackingId ? `Your Tracking ID is: <b>${trackingId}</b>` : ''}<br/><br/>You can track your order status live on our website: <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/track-order" style="color: #2563eb; font-weight: bold; text-decoration: none;">Track Order Here</a>`;
        } else if (status === 'Delivered') {
          statusTitle = 'Order Delivered! 🎁';
          statusMessage = 'Your order has been successfully delivered. We hope you enjoy your new industrial equipment!';
        }

        await sendEmail({
          email: customerEmail,
          subject: `${statusTitle} - Innovative Solutions Order #${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}`,
          message: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                @media only screen and (max-width: 600px) {
                  .container { width: 100% !important; padding: 20px !important; }
                  .header-box { padding: 40px 20px !important; }
                  .content-box { padding: 30px 20px !important; }
                  .item-table td { font-size: 13px !important; }
                  .status-badge { font-size: 24px !important; }
                }
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="850" class="container" style="background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                      <!-- Header -->
                      <tr>
                        <td class="header-box" align="center" style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 60px 40px;">
                          <!-- Professional Logo Section -->
                          <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                            <tr>
                              <td align="center" valign="middle" style="background: rgba(255,255,255,0.2); width: 70px; height: 70px; border-radius: 20px; color: #ffffff; font-family: 'Segoe UI', Arial, sans-serif; font-weight: 900; font-size: 28px; border: 2px solid rgba(255,255,255,0.3);">
                                IS
                              </td>
                            </tr>
                          </table>
                          
                          <h1 class="status-badge" style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; line-height: 1.2;">
                            ${statusTitle}
                          </h1>
                          <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: rgba(0,0,0,0.1); display: inline-block; padding: 5px 15px; border-radius: 50px;">
                            Order #${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}
                          </p>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td class="content-box" style="padding: 50px 40px;">
                          <p style="margin: 0 0 20px 0; color: #0f172a; font-size: 20px; font-weight: 800;">Hello ${customerName},</p>
                          <p style="margin: 0 0 40px 0; color: #475569; font-size: 16px; line-height: 1.8;">${statusMessage}</p>

                          <!-- Order Details -->
                          <div style="background-color: #f8fafc; border-radius: 24px; padding: 30px; border: 1px solid #e2e8f0; margin-bottom: 40px;">
                            <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">Order Summary</h3>
                            <table class="item-table" border="0" cellpadding="0" cellspacing="0" width="100%">
                              ${order.orderItems.map(item => `
                                <tr>
                                  <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${item.name} <span style="color: #64748b; font-size: 12px;">x${item.quantity}</span></td>
                                  <td align="right" style="padding: 12px 0; color: #0f172a; font-weight: 800;">Rs ${item.price.toLocaleString()}</td>
                                </tr>
                              `).join('')}
                              <tr>
                                <td style="padding: 20px 0 0 0; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 12px; font-weight: 900; text-transform: uppercase;">Grand Total</td>
                                <td align="right" style="padding: 20px 0 0 0; border-top: 2px solid #e2e8f0; color: #2563eb; font-size: 22px; font-weight: 900;">Rs ${order.totalPrice.toLocaleString()}</td>
                              </tr>
                            </table>
                          </div>

                          ${trackingId ? `
                          <!-- Tracking -->
                          <div style="text-align: center; background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 24px; padding: 30px; margin-bottom: 40px;">
                            <span style="display: block; color: #3b82f6; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Shipment Tracking ID</span>
                            <span style="display: block; color: #1e3a8a; font-size: 28px; font-weight: 900; letter-spacing: 3px; font-family: 'Courier New', Courier, monospace;">${trackingId}</span>
                          </div>
                          ` : ''}

                          <!-- Support -->
                          <div style="text-align: center;">
                            <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px; font-weight: 600;">Need help with your order? Our team is available on WhatsApp.</p>
                            <a href="https://wa.me/923117702133" style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 18px 40px; border-radius: 18px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3);">Chat with Support</a>
                          </div>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Innovative Solutions Industrial Platform</p>
                          <p style="margin: 10px 0 0 0; color: #cbd5e1; font-size: 11px;">This is an automated notification. Please do not reply directly to this email.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });
      }
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
