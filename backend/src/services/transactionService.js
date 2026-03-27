const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const httpError = require('../utils/httpError');

const createTransaction = async (payload, userId) => {
  const { productId, item, type, quantity, supplierId, customerId } = payload;
  const targetProductId = productId || item;

  if (!targetProductId || !type || quantity === undefined) {
    throw httpError(400, 'productId, type, and quantity are required');
  }

  const normalizedType = String(type).toUpperCase();
  const numericQty = Number(quantity);

  if (!['IN', 'OUT'].includes(normalizedType)) {
    throw httpError(400, 'type must be IN or OUT');
  }
  if (!Number.isFinite(numericQty) || numericQty <= 0) {
    throw httpError(400, 'quantity must be a positive number');
  }

  const product = await Product.findById(targetProductId);
  if (!product) throw httpError(404, 'Product not found');

  if (normalizedType === 'OUT' && product.quantity < numericQty) {
    throw httpError(400, 'Insufficient stock. Negative quantity not allowed.');
  }

  if (supplierId) {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw httpError(404, 'Supplier not found');
  }

  if (customerId) {
    const customer = await Customer.findById(customerId);
    if (!customer) throw httpError(404, 'Customer not found');
  }

  product.quantity = normalizedType === 'IN'
    ? product.quantity + numericQty
    : product.quantity - numericQty;
  await product.save();

  return Transaction.create({
    productId: targetProductId,
    supplierId: supplierId || undefined,
    customerId: customerId || undefined,
    type: normalizedType,
    quantity: numericQty,
    userId
  });
};

const listTransactions = async ({ type, date }) => {
  const query = {};

  if (type) {
    const normalizedType = String(type).toUpperCase();
    if (['IN', 'OUT'].includes(normalizedType)) {
      query.type = normalizedType;
    }
  }

  if (date) {
    const start = new Date(date);
    if (!Number.isNaN(start.getTime())) {
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
  }

  return Transaction.find(query)
    .populate('productId', 'name category quantity price')
    .populate('supplierId', 'name phone address')
    .populate('customerId', 'name phone address')
    .populate('userId', 'name email role')
    .sort({ date: -1 });
};

module.exports = {
  createTransaction,
  listTransactions
};

