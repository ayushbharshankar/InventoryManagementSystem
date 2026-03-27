const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const httpError = require('../utils/httpError');

const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return 'staff';
  return role.trim().toLowerCase();
};

const registerUser = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    throw httpError(400, 'name, email, and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) throw httpError(400, 'User already exists');

  const requestedRole = normalizeRole(role);
  const allowedRoles = ['admin', 'manager', 'staff'];
  if (!allowedRoles.includes(requestedRole)) {
    throw httpError(400, 'Invalid role. Use Admin, Manager, or Staff.');
  }

  const totalUsers = await User.countDocuments();
  const userRole = totalUsers === 0 ? 'admin' : requestedRole;
  const user = await User.create({ name, email, password, role: userRole });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw httpError(400, 'email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw httpError(401, 'Invalid email or password');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

module.exports = {
  registerUser,
  loginUser
};

