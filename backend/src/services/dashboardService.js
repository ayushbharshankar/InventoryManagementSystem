const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const getDashboardAnalytics = async () => {
  const [productStats, transactionStats] = await Promise.all([
    Product.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalStockQuantity: { $sum: '$quantity' },
                totalStockValue: { $sum: { $multiply: ['$quantity', '$price'] } }
              }
            }
          ],
          lowStockItems: [
            { $match: { quantity: { $lt: 10 } } },
            { $sort: { quantity: 1, createdAt: -1 } },
            { $project: { _id: 1, name: 1, category: 1, quantity: 1, price: 1, createdAt: 1 } }
          ],
          stockByCategory: [
            {
              $group: {
                _id: '$category',
                productCount: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
                totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
              }
            },
            { $sort: { totalQuantity: -1 } }
          ]
        }
      }
    ]),
    Transaction.aggregate([
      {
        $facet: {
          recentTransactions: [
            { $sort: { date: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                type: 1,
                quantity: 1,
                date: 1,
                product: { _id: '$product._id', name: '$product.name', category: '$product.category' }
              }
            }
          ],
          stockSummary: [
            { $group: { _id: '$type', transactionCount: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } }
          ]
        }
      }
    ])
  ]);

  const productFacet = productStats[0] || {};
  const transactionFacet = transactionStats[0] || {};
  const totals = productFacet.totals?.[0] || { totalProducts: 0, totalStockQuantity: 0, totalStockValue: 0 };
  const lowStockItems = productFacet.lowStockItems || [];
  const stockByCategory = productFacet.stockByCategory || [];
  const recentTransactions = transactionFacet.recentTransactions || [];
  const stockSummaryRows = transactionFacet.stockSummary || [];
  const inSummary = stockSummaryRows.find((row) => row._id === 'IN') || { transactionCount: 0, totalQuantity: 0 };
  const outSummary = stockSummaryRows.find((row) => row._id === 'OUT') || { transactionCount: 0, totalQuantity: 0 };

  return {
    totalProducts: totals.totalProducts,
    lowStockItems: { count: lowStockItems.length, items: lowStockItems },
    recentTransactions,
    stockSummary: {
      totalStockQuantity: totals.totalStockQuantity,
      totalStockValue: totals.totalStockValue,
      stockIn: { transactionCount: inSummary.transactionCount, totalQuantity: inSummary.totalQuantity },
      stockOut: { transactionCount: outSummary.transactionCount, totalQuantity: outSummary.totalQuantity },
      byCategory: stockByCategory
    },
    cards: { totalItems: totals.totalProducts, lowStockItems: lowStockItems.length },
    transactionsSummary: { stockInCount: inSummary.transactionCount, stockOutCount: outSummary.transactionCount }
  };
};

const getReports = async ({ dateFrom, dateTo, product: productId, type }) => {
  const productMatch = {};
  if (productId && mongoose.Types.ObjectId.isValid(productId)) {
    productMatch._id = new mongoose.Types.ObjectId(productId);
  }

  const transactionMatch = {};
  if (productId && mongoose.Types.ObjectId.isValid(productId)) {
    transactionMatch.productId = new mongoose.Types.ObjectId(productId);
  }
  if (type) {
    const normalizedType = String(type).toUpperCase();
    if (['IN', 'OUT'].includes(normalizedType)) transactionMatch.type = normalizedType;
  }
  if (dateFrom || dateTo) {
    transactionMatch.date = {};
    if (dateFrom) {
      const from = new Date(dateFrom);
      if (!Number.isNaN(from.getTime())) transactionMatch.date.$gte = from;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      if (!Number.isNaN(to.getTime())) {
        to.setHours(23, 59, 59, 999);
        transactionMatch.date.$lte = to;
      }
    }
    if (!transactionMatch.date.$gte && !transactionMatch.date.$lte) delete transactionMatch.date;
  }

  const [stockReport, lowStockReport, transactionReport] = await Promise.all([
    Product.aggregate([
      { $match: productMatch },
      { $project: { _id: 1, name: 1, category: 1, quantity: 1, price: 1, stockValue: { $multiply: ['$quantity', '$price'] }, createdAt: 1 } },
      { $sort: { quantity: -1, name: 1 } }
    ]),
    Product.aggregate([
      { $match: { ...productMatch, quantity: { $lt: 10 } } },
      { $project: { _id: 1, name: 1, category: 1, quantity: 1, price: 1, stockValue: { $multiply: ['$quantity', '$price'] }, createdAt: 1 } },
      { $sort: { quantity: 1, name: 1 } }
    ]),
    Transaction.aggregate([
      { $match: transactionMatch },
      {
        $facet: {
          data: [
            { $sort: { date: -1 } },
            { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            { $project: { _id: 1, date: 1, type: 1, quantity: 1, userId: 1, product: { _id: '$product._id', name: '$product.name', category: '$product.category' } } }
          ],
          summary: [
            { $group: { _id: '$type', transactionCount: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } }
          ]
        }
      }
    ])
  ]);

  const txFacet = transactionReport[0] || { data: [], summary: [] };
  const inSummary = txFacet.summary.find((row) => row._id === 'IN') || { transactionCount: 0, totalQuantity: 0 };
  const outSummary = txFacet.summary.find((row) => row._id === 'OUT') || { transactionCount: 0, totalQuantity: 0 };

  return {
    filters: { dateFrom: dateFrom || null, dateTo: dateTo || null, product: productId || null, type: type || null },
    stockReport: { totalProducts: stockReport.length, items: stockReport },
    lowStockReport: { count: lowStockReport.length, items: lowStockReport },
    transactionReport: {
      totalTransactions: txFacet.data.length,
      items: txFacet.data,
      summary: { IN: inSummary, OUT: outSummary }
    }
  };
};

module.exports = {
  getDashboardAnalytics,
  getReports
};

