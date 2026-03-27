const express = require('express');
const { createItem, getItems, getItemById, updateItem, deleteItem } = require('../controllers/inventoryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getItems).post(protect, authorizeRoles('admin', 'manager'), createItem);
router.route('/:id').get(protect, getItemById).put(protect, authorizeRoles('admin', 'manager'), updateItem).delete(protect, authorizeRoles('admin'), deleteItem);

module.exports = router;
