const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Product', productSchema);

