const express = require('express');
const { getDashboardAnalytics, getReports } = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/analytics', protect, getDashboardAnalytics);
router.get('/reports', protect, authorizeRoles('admin', 'manager'), getReports);

module.exports = router;
