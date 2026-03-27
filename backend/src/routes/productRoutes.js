const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { productValidation } = require('../validators');

const router = express.Router();

router
  .route('/')
  .post(protect, authorizeRoles('admin', 'manager'), productValidation.create, validateRequest, createProduct)
  .get(protect, productValidation.list, validateRequest, getProducts);

router
  .route('/:id')
  .get(protect, productValidation.byId, validateRequest, getProductById)
  .put(protect, authorizeRoles('admin', 'manager'), productValidation.update, validateRequest, updateProduct)
  .delete(protect, authorizeRoles('admin'), productValidation.byId, validateRequest, deleteProduct);

module.exports = router;

