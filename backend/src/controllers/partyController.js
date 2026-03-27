const asyncHandler = require('../middleware/asyncHandler');
const partyService = require('../services/partyService');

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await partyService.createSupplier(req.body);
  res.status(201).json(supplier);
});
const listSupplier = asyncHandler(async (req, res) => {
  const suppliers = await partyService.listSuppliers();
  res.json(suppliers);
});
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await partyService.getSupplierById(req.params.id);
  res.json(supplier);
});
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await partyService.updateSupplier(req.params.id, req.body);
  res.json(supplier);
});
const removeSupplier = asyncHandler(async (req, res) => {
  const result = await partyService.removeSupplier(req.params.id);
  res.json(result);
});

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await partyService.createCustomer(req.body);
  res.status(201).json(customer);
});
const listCustomer = asyncHandler(async (req, res) => {
  const customers = await partyService.listCustomers();
  res.json(customers);
});
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await partyService.getCustomerById(req.params.id);
  res.json(customer);
});
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await partyService.updateCustomer(req.params.id, req.body);
  res.json(customer);
});
const removeCustomer = asyncHandler(async (req, res) => {
  const result = await partyService.removeCustomer(req.params.id);
  res.json(result);
});

module.exports = {
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
};
