import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/common/DataTable';
import { productApi } from '../services/api';
import { alertApiError } from '../utils/apiError';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productApi.getAll({
        search: search || undefined,
        category: category || undefined,
        page,
        limit: pagination.limit
      });
      setProducts(response.data || []);
      setPagination(response.pagination || { total: 0, totalPages: 1, page: 1, limit: 10 });
    } catch (err) {
      setError(alertApiError(err, 'Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const onSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.remove(id);
      fetchProducts();
    } catch (err) {
      setError(alertApiError(err, 'Failed to delete product'));
    }
  };

  return (
    <section>
      <div className="page-title-row">
        <h1>Product List</h1>
        <Link className="btn-link" to="/products/new">Add Product</Link>
      </div>

      <form className="card filters-row" onSubmit={onSearch}>
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button type="submit">Apply</button>
      </form>

      {loading ? <p className="status">Loading products...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'price', label: 'Price' },
          { key: 'createdAt', label: 'Created At', render: (row) => new Date(row.createdAt).toLocaleDateString() },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="actions">
                <Link className="text-link" to={`/products/${row._id}/edit`}>Edit</Link>
                <button type="button" onClick={() => handleDelete(row._id)}>Delete</button>
              </div>
            )
          }
        ]}
        rows={products}
      />

      <div className="pagination-row">
        <button type="button" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
          Prev
        </button>
        <span>Page {page} of {pagination.totalPages || 1}</span>
        <button
          type="button"
          disabled={page >= (pagination.totalPages || 1)}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default ProductListPage;

