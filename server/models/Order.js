const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestInfo: {
    name: { type: String },
    email: { type: String }
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Bank Transfer'
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  trackingId: {
    type: String
  },
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

// Pre-save hook to generate professional order number (IS001, IS002...)
orderSchema.pre('save', async function() {
  if (this.isNew) {
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let nextNumber = 1;
    
    if (lastOrder && lastOrder.orderNumber) {
      // Extract number from IS001 format
      const lastNumberMatch = lastOrder.orderNumber.match(/\d+/);
      if (lastNumberMatch) {
        nextNumber = parseInt(lastNumberMatch[0]) + 1;
      }
    }
    
    // Format: IS followed by 3 digits (padding with zeros)
    this.orderNumber = `IS${nextNumber.toString().padStart(3, '0')}`;
  }
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
