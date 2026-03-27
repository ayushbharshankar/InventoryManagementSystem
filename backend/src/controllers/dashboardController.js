const asyncHandler = require('../middleware/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardAnalytics();
  res.json(data);
});

const getReports = asyncHandler(async (req, res) => {
  const data = await dashboardService.getReports(req.query);
  res.json(data);
});

module.exports = { getDashboardAnalytics, getReports };
