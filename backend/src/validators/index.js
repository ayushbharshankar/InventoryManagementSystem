const { body, param, query } = require('express-validator');

const objectIdMessage = 'Must be a valid MongoDB ObjectId';

const authValidation = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name is too short'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
      .isString().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .trim()
      .toLowerCase()
      .isIn(['admin', 'manager', 'staff'])
      .withMessage('Role must be admin, manager, or staff')
  ],
  login: [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isString().withMessage('Password is required').notEmpty().withMessage('Password is required')
  ]
};

const productValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Product name is required').isLength({ min: 2 }).withMessage('Name is too short'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be >= 0').toFloat(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0').toFloat()
  ],
  update: [
    param('id').isMongoId().withMessage(objectIdMessage),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be >= 0').toFloat(),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be >= 0').toFloat()
  ],
  byId: [param('id').isMongoId().withMessage(objectIdMessage)],
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100').toInt(),
    query('search').optional().trim(),
    query('category').optional().trim()
  ]
};

const transactionValidation = {
  create: [
    body('productId')
      .optional()
      .isMongoId().withMessage('productId must be a valid MongoDB ObjectId'),
    body('item')
      .optional()
      .isMongoId().withMessage('item must be a valid MongoDB ObjectId'),
    body('type').trim().toUpperCase().isIn(['IN', 'OUT']).withMessage('type must be IN or OUT'),
    body('quantity').isFloat({ min: 1 }).withMessage('quantity must be >= 1').toFloat(),
    body().custom((value) => {
      if (!value.productId && !value.item) throw new Error('productId is required');
      return true;
    }),
    body('supplierId').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('supplierId must be a valid ObjectId'),
    body('customerId').optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage('customerId must be a valid ObjectId')
  ],
  list: [
    query('type').optional().trim().toUpperCase().isIn(['IN', 'OUT']).withMessage('type must be IN or OUT'),
    query('date').optional().isISO8601().withMessage('date must be a valid date')
  ]
};

const partyValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name is too short'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('address').optional().trim()
  ],
  update: [
    param('id').isMongoId().withMessage(objectIdMessage),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
    body('address').optional().trim()
  ],
  byId: [param('id').isMongoId().withMessage(objectIdMessage)]
};

module.exports = {
  authValidation,
  productValidation,
  transactionValidation,
  partyValidation
};

