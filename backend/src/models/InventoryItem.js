const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 5, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
