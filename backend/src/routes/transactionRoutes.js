const express = require('express');
const { createTransaction, getTransactions } = require('../controllers/transactionController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { transactionValidation } = require('../validators');
const router = express.Router();

router
  .route('/')
  .get(protect, transactionValidation.list, validateRequest, getTransactions)
  .post(protect, authorizeRoles('admin', 'manager', 'staff'), transactionValidation.create, validateRequest, createTransaction);

module.exports = router;
