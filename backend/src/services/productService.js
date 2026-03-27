const Product = require('../models/Product');
const httpError = require('../utils/httpError');

const createProduct = async ({ name, category, quantity, price }) => {
  return Product.create({
    name,
    category,
    quantity: Number(quantity),
    price: Number(price)
  });
};

const listProducts = async ({ search, category, page = 1, limit = 10 }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.max(Number(limit) || 10, 1);
  const skip = (safePage - 1) * safeLimit;

  const query = {};
  if (search) query.name = { $regex: String(search).trim(), $options: 'i' };
  if (category) query.category = { $regex: `^${String(category).trim()}$`, $options: 'i' };

  const [items, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    Product.countDocuments(query)
  ]);

  return {
    data: items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit)
    }
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw httpError(404, 'Product not found');
  return product;
};

const updateProduct = async (id, payload) => {
  const product = await getProductById(id);
  const { name, category, quantity, price } = payload;

  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (quantity !== undefined) product.quantity = Number(quantity);
  if (price !== undefined) product.price = Number(price);

  await product.save();
  return product;
};

const deleteProduct = async (id) => {
  const product = await getProductById(id);
  await product.deleteOne();
  return { message: 'Product deleted' };
};

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

