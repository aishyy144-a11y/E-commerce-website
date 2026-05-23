const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
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

module.exports = mongoose.model('Inquiry', inquirySchema);
