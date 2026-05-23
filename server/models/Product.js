const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  modelNumber: { type: String },
  brand: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: String },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  specifications: { type: Map, of: String },
  accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isFeatured: { type: Boolean, default: false },
  requiresQuote: { type: Boolean, default: false },
}, { timestamps: true });

// Add indexes for faster search
productSchema.index({ name: 'text', modelNumber: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
