const express = require('express');
const {
  createSupplier,
  listSupplier,
  getSupplierById,
  updateSupplier,
  removeSupplier,
  createCustomer,
  listCustomer,
  getCustomerById,
  updateCustomer,
  removeCustomer
} = require('../controllers/partyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { partyValidation } = require('../validators');
const router = express.Router();

router
  .route('/suppliers')
  .get(protect, listSupplier)
  .post(protect, authorizeRoles('admin', 'manager'), partyValidation.create, validateRequest, createSupplier);

router
  .route('/suppliers/:id')
  .get(protect, partyValidation.byId, validateRequest, getSupplierById)
  .put(protect, authorizeRoles('admin', 'manager'), partyValidation.update, validateRequest, updateSupplier)
  .delete(protect, authorizeRoles('admin'), partyValidation.byId, validateRequest, removeSupplier);

router
  .route('/customers')
  .get(protect, listCustomer)
  .post(protect, authorizeRoles('admin', 'manager', 'staff'), partyValidation.create, validateRequest, createCustomer);

router
  .route('/customers/:id')
  .get(protect, partyValidation.byId, validateRequest, getCustomerById)
  .put(protect, authorizeRoles('admin', 'manager'), partyValidation.update, validateRequest, updateCustomer)
  .delete(protect, authorizeRoles('admin'), partyValidation.byId, validateRequest, removeCustomer);

module.exports = router;
