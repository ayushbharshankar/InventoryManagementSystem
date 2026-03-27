import { useEffect, useState } from 'react';
import DataTable from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';
import { partyApi, productApi, transactionApi } from '../services/api';
import { alertApiError } from '../utils/apiError';

function TransactionsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    productId: '',
    supplierId: '',
    customerId: '',
    type: 'IN',
    quantity: 1
  });
  const [filters, setFilters] = useState({ date: '', type: '' });

  const loadProducts = async () => {
    try {
      const response = await productApi.getAll({ page: 1, limit: 1000 });
      setProducts(response.data || []);
    } catch (err) {
      setError(alertApiError(err, 'Failed to fetch products'));
    }
  };

  const loadParties = async () => {
    try {
      const [supplierData, customerData] = await Promise.all([
        partyApi.suppliers(token),
        partyApi.customers(token)
      ]);
      setSuppliers(supplierData || []);
      setCustomers(customerData || []);
    } catch (err) {
      setError(alertApiError(err, 'Failed to fetch suppliers/customers'));
    }
  };

  const loadTransactions = async (activeFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const data = await transactionApi.getAll(token, {
        date: activeFilters.date || undefined,
        type: activeFilters.type || undefined
      });
      setTransactions(data || []);
    } catch (err) {
      setError(alertApiError(err, 'Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadParties();
    loadTransactions({ date: '', type: '' });
  }, [token]);

  const submitTransaction = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await transactionApi.create(token, {
        productId: form.productId,
        supplierId: form.supplierId || undefined,
        customerId: form.customerId || undefined,
        type: form.type,
        quantity: Number(form.quantity)
      });
      setForm({ productId: '', supplierId: '', customerId: '', type: 'IN', quantity: 1 });
      loadProducts();
      loadTransactions();
    } catch (err) {
      setError(alertApiError(err, 'Failed to save transaction'));
    }
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadTransactions(filters);
  };

  return (
    <section>
      <h1>Stock Transactions</h1>

      <form className="card form-grid" onSubmit={submitTransaction}>
        <h3>Add Stock In/Out</h3>
        <select
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} ({product.category}) - Qty: {product.quantity}
            </option>
          ))}
        </select>
        <select
          value={form.supplierId}
          onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
        >
          <option value="">Select Supplier (optional)</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
          ))}
        </select>
        <select
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: e.target.value })}
        >
          <option value="">Select Customer (optional)</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>{customer.name}</option>
          ))}
        </select>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="IN">Stock IN</option>
          <option value="OUT">Stock OUT</option>
        </select>
        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit">Save Transaction</button>
      </form>

      <form className="card filters-row" onSubmit={applyFilters}>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>
        <button type="submit">Filter</button>
      </form>

      {loading ? <p className="status">Loading transactions...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <DataTable
        columns={[
          { key: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleString() },
          { key: 'productId', label: 'Product', render: (row) => row.productId?.name || '-' },
          { key: 'supplierId', label: 'Supplier', render: (row) => row.supplierId?.name || '-' },
          { key: 'customerId', label: 'Customer', render: (row) => row.customerId?.name || '-' },
          { key: 'type', label: 'Type' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'userId', label: 'User', render: (row) => row.userId?.name || '-' }
        ]}
        rows={transactions}
      />
    </section>
  );
}

export default TransactionsPage;
