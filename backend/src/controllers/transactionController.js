const asyncHandler = require('../middleware/asyncHandler');
const transactionService = require('../services/transactionService');

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.body, req.user._id);
  res.status(201).json(transaction);
});

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.listTransactions(req.query);
  res.json(transactions);
});

module.exports = { createTransaction, getTransactions };
