const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { authValidation } = require('../validators');
const router = express.Router();

router.post('/register', authValidation.register, validateRequest, register);
router.post('/register/admin-only', protect, authorizeRoles('admin'), authValidation.register, validateRequest, register);
router.post('/login', authValidation.login, validateRequest, login);
router.get('/me', protect, getProfile);
router.get('/profile', protect, getProfile);

module.exports = router;
