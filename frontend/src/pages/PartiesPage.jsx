import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';
import { partyApi } from '../services/api';
import { alertApiError } from '../utils/apiError';

function PartiesPage() {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [supplierForm, setSupplierForm] = useState({ name: '', phone: '', address: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '' });
  const [editingSupplierId, setEditingSupplierId] = useState('');
  const [editingCustomerId, setEditingCustomerId] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [error, setError] = useState('');

  const loadParties = async () => {
    setError('');
    try {
      const [supplierData, customerData] = await Promise.all([
        partyApi.suppliers(token),
        partyApi.customers(token)
      ]);
      setSuppliers(supplierData || []);
      setCustomers(customerData || []);
    } catch (err) {
      setError(alertApiError(err, 'Failed to load suppliers/customers'));
    }
  };

  useEffect(() => {
    loadParties();
  }, [token]);

  const filteredSuppliers = useMemo(() => (
    suppliers.filter((s) => s.name.toLowerCase().includes(supplierSearch.toLowerCase()))
  ), [suppliers, supplierSearch]);

  const filteredCustomers = useMemo(() => (
    customers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
  ), [customers, customerSearch]);

  const submitSupplier = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingSupplierId) {
        await partyApi.updateSupplier(token, editingSupplierId, supplierForm);
      } else {
        await partyApi.createSupplier(token, supplierForm);
      }
      setSupplierForm({ name: '', phone: '', address: '' });
      setEditingSupplierId('');
      loadParties();
    } catch (err) {
      setError(alertApiError(err, 'Failed to save supplier'));
    }
  };

  const submitCustomer = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingCustomerId) {
        await partyApi.updateCustomer(token, editingCustomerId, customerForm);
      } else {
        await partyApi.createCustomer(token, customerForm);
      }
      setCustomerForm({ name: '', phone: '', address: '' });
      setEditingCustomerId('');
      loadParties();
    } catch (err) {
      setError(alertApiError(err, 'Failed to save customer'));
    }
  };

  const editSupplier = (row) => {
    setEditingSupplierId(row._id);
    setSupplierForm({ name: row.name || '', phone: row.phone || '', address: row.address || '' });
  };

  const editCustomer = (row) => {
    setEditingCustomerId(row._id);
    setCustomerForm({ name: row.name || '', phone: row.phone || '', address: row.address || '' });
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await partyApi.deleteSupplier(token, id);
      loadParties();
    } catch (err) {
      setError(alertApiError(err, 'Failed to delete supplier'));
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await partyApi.deleteCustomer(token, id);
      loadParties();
    } catch (err) {
      setError(alertApiError(err, 'Failed to delete customer'));
    }
  };

  return (
    <section>
      <h1>Suppliers & Customers</h1>
      {error ? <p className="error">{error}</p> : null}

      <div className="split-grid">
        <div>
          <h3>Suppliers</h3>
          <form className="card form-grid" onSubmit={submitSupplier}>
            <input
              placeholder="Supplier name"
              value={supplierForm.name}
              onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Phone"
              value={supplierForm.phone}
              onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
              required
            />
            <input
              placeholder="Address"
              value={supplierForm.address}
              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
            />
            <button type="submit">{editingSupplierId ? 'Update Supplier' : 'Add Supplier'}</button>
          </form>

          <input
            placeholder="Search suppliers"
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
          />
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'address', label: 'Address' },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="actions">
                    <button type="button" onClick={() => editSupplier(row)}>Edit</button>
                    <button type="button" onClick={() => deleteSupplier(row._id)}>Delete</button>
                  </div>
                )
              }
            ]}
            rows={filteredSuppliers}
          />
        </div>

        <div>
          <h3>Customers</h3>
          <form className="card form-grid" onSubmit={submitCustomer}>
            <input
              placeholder="Customer name"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Phone"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              required
            />
            <input
              placeholder="Address"
              value={customerForm.address}
              onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
            />
            <button type="submit">{editingCustomerId ? 'Update Customer' : 'Add Customer'}</button>
          </form>

          <input
            placeholder="Search customers"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'address', label: 'Address' },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="actions">
                    <button type="button" onClick={() => editCustomer(row)}>Edit</button>
                    <button type="button" onClick={() => deleteCustomer(row._id)}>Delete</button>
                  </div>
                )
              }
            ]}
            rows={filteredCustomers}
          />
        </div>
      </div>
    </section>
  );
}

export default PartiesPage;
