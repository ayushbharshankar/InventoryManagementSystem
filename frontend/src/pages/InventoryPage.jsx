import { useEffect, useState } from 'react';
import DataTable from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';
import { inventoryApi } from '../services/api';
import useFetchData from '../hooks/useFetchData';
import { alertApiError } from '../utils/apiError';

function InventoryPage() {
  const { token, user } = useAuth();
  const { data, loading, error, run } = useFetchData(inventoryApi.getAll);
  const [form, setForm] = useState({ sku: '', name: '', category: 'General', quantity: 0, reorderLevel: 5, unitPrice: 0 });
  const canManage = ['admin', 'manager'].includes(user?.role);
  useEffect(() => { run(token); }, [run, token]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.create(token, { ...form, quantity: Number(form.quantity), reorderLevel: Number(form.reorderLevel), unitPrice: Number(form.unitPrice) });
      setForm({ sku: '', name: '', category: 'General', quantity: 0, reorderLevel: 5, unitPrice: 0 });
      run(token);
    } catch (err) {
      alertApiError(err, 'Failed to save inventory item');
    }
  };

  return (<section>
    <h1>Inventory Management</h1>
    {loading ? <p className="status">Loading inventory...</p> : null}
    {error ? <p className="error">{error}</p> : null}
    {canManage ? <form className="card form-grid" onSubmit={submit}>
      <h3>Add Item</h3>
      <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
      <input type="number" placeholder="Reorder" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} required />
      <input type="number" placeholder="Unit Price" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
      <button type="submit">Save Item</button>
    </form> : null}
    <DataTable columns={[{ key: 'sku', label: 'SKU' }, { key: 'name', label: 'Name' }, { key: 'category', label: 'Category' }, { key: 'quantity', label: 'Qty' }, { key: 'reorderLevel', label: 'Reorder' }, { key: 'unitPrice', label: 'Price' }]} rows={data} />
  </section>);
}

export default InventoryPage;
