const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Transaction', transactionSchema);
