const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  subject: {
    type: String
  },
  quantity: {
    type: Number,
    default: 1
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  }
}, { timestamps: true });

inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ product: 1 });
inquirySchema.index({ products: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
