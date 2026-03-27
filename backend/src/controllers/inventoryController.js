const asyncHandler = require('../middleware/asyncHandler');
const inventoryService = require('../services/inventoryService');

const createItem = asyncHandler(async (req, res) => {
  const item = await inventoryService.createInventoryItem(req.body, req.user._id);
  res.status(201).json(item);
});

const getItems = asyncHandler(async (req, res) => {
  const items = await inventoryService.listInventoryItems();
  res.json(items);
});

const getItemById = asyncHandler(async (req, res) => {
  const item = await inventoryService.getInventoryItemById(req.params.id);
  res.json(item);
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await inventoryService.updateInventoryItem(req.params.id, req.body);
  res.json(item);
});

const deleteItem = asyncHandler(async (req, res) => {
  const result = await inventoryService.deleteInventoryItem(req.params.id);
  res.json(result);
});

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem };
