const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  iconName: { type: String }, // For frontend icon mapping
}, { timestamps: true });

categorySchema.index({ name: 1, slug: 1 });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
