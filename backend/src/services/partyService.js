const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const httpError = require('../utils/httpError');

const getByIdOrThrow = async (Model, id, label) => {
  const doc = await Model.findById(id);
  if (!doc) throw httpError(404, `${label} not found`);
  return doc;
};

const createSupplier = async (payload) => Supplier.create(payload);
const listSuppliers = async () => Supplier.find().sort({ createdAt: -1 });
const getSupplierById = async (id) => getByIdOrThrow(Supplier, id, 'Supplier');
const updateSupplier = async (id, payload) => {
  const doc = await getSupplierById(id);
  Object.assign(doc, payload);
  await doc.save();
  return doc;
};
const removeSupplier = async (id) => {
  const doc = await getSupplierById(id);
  await doc.deleteOne();
  return { message: 'Supplier removed' };
};

const createCustomer = async (payload) => Customer.create(payload);
const listCustomers = async () => Customer.find().sort({ createdAt: -1 });
const getCustomerById = async (id) => getByIdOrThrow(Customer, id, 'Customer');
const updateCustomer = async (id, payload) => {
  const doc = await getCustomerById(id);
  Object.assign(doc, payload);
  await doc.save();
  return doc;
};
const removeCustomer = async (id) => {
  const doc = await getCustomerById(id);
  await doc.deleteOne();
  return { message: 'Customer removed' };
};

module.exports = {
  createSupplier,
  listSuppliers,
  getSupplierById,
  updateSupplier,
  removeSupplier,
  createCustomer,
  listCustomers,
  getCustomerById,
  updateCustomer,
  removeCustomer
};

