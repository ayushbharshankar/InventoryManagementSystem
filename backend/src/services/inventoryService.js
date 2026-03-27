const InventoryItem = require('../models/InventoryItem');
const httpError = require('../utils/httpError');

const createInventoryItem = async (payload, userId) => {
  return InventoryItem.create({ ...payload, createdBy: userId });
};

const listInventoryItems = async () => {
  return InventoryItem.find().populate('supplier', 'name email').sort({ createdAt: -1 });
};

const getInventoryItemById = async (id) => {
  const item = await InventoryItem.findById(id).populate('supplier', 'name');
  if (!item) throw httpError(404, 'Item not found');
  return item;
};

const updateInventoryItem = async (id, payload) => {
  const item = await InventoryItem.findById(id);
  if (!item) throw httpError(404, 'Item not found');
  Object.assign(item, payload);
  await item.save();
  return item;
};

const deleteInventoryItem = async (id) => {
  const item = await InventoryItem.findById(id);
  if (!item) throw httpError(404, 'Item not found');
  await item.deleteOne();
  return { message: 'Item removed' };
};

module.exports = {
  createInventoryItem,
  listInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem
};

