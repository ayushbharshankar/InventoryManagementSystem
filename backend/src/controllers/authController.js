const asyncHandler = require('../middleware/asyncHandler');
const { registerUser, loginUser } = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getProfile };
