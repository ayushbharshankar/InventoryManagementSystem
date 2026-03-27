import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi, productApi } from '../services/api';
import DataTable from '../components/common/DataTable';
import { downloadCsv, rowsToCsv } from '../utils/csvExport';
import { alertApiError } from '../utils/apiError';

const emptyFilters = {
  dateFrom: '',
  dateTo: '',
  productId: '',
  type: ''
};

function ReportsPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      const res = await productApi.getAll({ page: 1, limit: 500 });
      setProducts(res.data || []);
    } catch {
      setProducts([]);
    }
  }, []);

  const fetchReports = useCallback(async (active) => {
    setLoading(true);
    setError('');
    const params = {};
    if (active.dateFrom) params.dateFrom = active.dateFrom;
    if (active.dateTo) params.dateTo = active.dateTo;
    if (active.productId) params.product = active.productId;
    if (active.type) params.type = active.type;
    try {
      const res = await dashboardApi.reports(token, params);
      setData(res);
    } catch (err) {
      setError(alertApiError(err, 'Failed to load reports'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    fetchReports(applied);
  }, [fetchReports, applied]);

  const applyFilters = (e) => {
    e.preventDefault();
    setApplied({ ...filters });
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
  };

  const stockItems = data?.stockReport?.items || [];
  const lowItems = data?.lowStockReport?.items || [];
  const txItems = data?.transactionReport?.items || [];
  const summary = data?.transactionReport?.summary;

  const exportStockCsv = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Price', 'Stock Value', 'Created'];
    const rows = stockItems.map((r) => [
      r.name,
      r.category,
      r.quantity,
      r.price,
      r.stockValue ?? (r.quantity * r.price),
      r.createdAt ? new Date(r.createdAt).toISOString() : ''
    ]);
    downloadCsv('stock-report.csv', rowsToCsv(headers, rows));
  };

  const exportLowStockCsv = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Price', 'Stock Value', 'Created'];
    const rows = lowItems.map((r) => [
      r.name,
      r.category,
      r.quantity,
      r.price,
      r.stockValue ?? (r.quantity * r.price),
      r.createdAt ? new Date(r.createdAt).toISOString() : ''
    ]);
    downloadCsv('low-stock-report.csv', rowsToCsv(headers, rows));
  };

  const exportTransactionsCsv = () => {
    const headers = ['Date', 'Type', 'Quantity', 'Product', 'Category'];
    const rows = txItems.map((r) => [
      r.date ? new Date(r.date).toISOString() : '',
      r.type,
      r.quantity,
      r.product?.name || '',
      r.product?.category || ''
    ]);
    downloadCsv('transaction-report.csv', rowsToCsv(headers, rows));
  };

  return (
    <section className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p className="reports-subtitle">Stock, low stock, and transaction data with filters and CSV export.</p>
        </div>
      </div>

      <form className="reports-filters card" onSubmit={applyFilters}>
        <div className="reports-filters-grid">
          <label className="reports-field">
            <span>From</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </label>
          <label className="reports-field">
            <span>To</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </label>
          <label className="reports-field">
            <span>Product</span>
            <select
              value={filters.productId}
              onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
            >
              <option value="">All products</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label className="reports-field">
            <span>Type</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </label>
        </div>
        <div className="reports-filters-actions">
          <button type="submit" className="btn-primary">Apply filters</button>
          <button type="button" className="btn-secondary" onClick={clearFilters}>Clear</button>
        </div>
      </form>

      {loading ? <p className="status">Loading reports...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {data?.transactionReport?.summary && (
        <div className="reports-summary">
          <div className="reports-summary-card">
            <span className="label">IN</span>
            <strong>{summary.IN?.transactionCount ?? 0}</strong>
            <span className="muted">qty {summary.IN?.totalQuantity ?? 0}</span>
          </div>
          <div className="reports-summary-card">
            <span className="label">OUT</span>
            <strong>{summary.OUT?.transactionCount ?? 0}</strong>
            <span className="muted">qty {summary.OUT?.totalQuantity ?? 0}</span>
          </div>
        </div>
      )}

      <div className="reports-section card">
        <div className="reports-section-head">
          <h2>Stock report</h2>
          <div className="reports-section-actions">
            <span className="reports-count">{data?.stockReport?.totalProducts ?? 0} products</span>
            <button type="button" className="btn-export" onClick={exportStockCsv} disabled={!stockItems.length}>
              Export CSV
            </button>
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'quantity', label: 'Qty' },
            { key: 'price', label: 'Price' },
            { key: 'stockValue', label: 'Value', render: (r) => (r.stockValue ?? (r.quantity * r.price)).toFixed(2) },
            { key: 'createdAt', label: 'Created', render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') }
          ]}
          rows={stockItems}
        />
      </div>

      <div className="reports-section card">
        <div className="reports-section-head">
          <h2>Low stock (&lt; 10)</h2>
          <div className="reports-section-actions">
            <span className="reports-count">{data?.lowStockReport?.count ?? 0} items</span>
            <button type="button" className="btn-export" onClick={exportLowStockCsv} disabled={!lowItems.length}>
              Export CSV
            </button>
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'quantity', label: 'Qty' },
            { key: 'price', label: 'Price' },
            { key: 'stockValue', label: 'Value', render: (r) => (r.stockValue ?? (r.quantity * r.price)).toFixed(2) }
          ]}
          rows={lowItems}
        />
      </div>

      <div className="reports-section card">
        <div className="reports-section-head">
          <h2>Transaction report</h2>
          <div className="reports-section-actions">
            <span className="reports-count">{data?.transactionReport?.totalTransactions ?? 0} rows</span>
            <button type="button" className="btn-export" onClick={exportTransactionsCsv} disabled={!txItems.length}>
              Export CSV
            </button>
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'date', label: 'Date', render: (r) => (r.date ? new Date(r.date).toLocaleString() : '—') },
            { key: 'type', label: 'Type' },
            { key: 'quantity', label: 'Qty' },
            { key: 'product', label: 'Product', render: (r) => r.product?.name || '—' },
            { key: 'category', label: 'Category', render: (r) => r.product?.category || '—' }
          ]}
          rows={txItems}
        />
      </div>
    </section>
  );
}

export default ReportsPage;
