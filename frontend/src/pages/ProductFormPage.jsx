import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../services/api';
import { alertApiError } from '../utils/apiError';

function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0
  });
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOne = async () => {
      if (!isEdit) return;
      try {
        const data = await productApi.getById(id);
        setForm({
          name: data.name || '',
          category: data.category || '',
          quantity: data.quantity ?? 0,
          price: data.price ?? 0
        });
      } catch (err) {
        setError(alertApiError(err, 'Failed to load product'));
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id, isEdit]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const payload = {
        name: form.name,
        category: form.category,
        quantity: Number(form.quantity),
        price: Number(form.price)
      };
      if (isEdit) {
        await productApi.update(id, payload);
      } else {
        await productApi.create(payload);
      }
      navigate('/products');
    } catch (err) {
      setError(alertApiError(err, 'Failed to save product'));
    }
  };

  return (
    <section>
      <div className="page-title-row">
        <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <Link className="text-link" to="/products">Back to List</Link>
      </div>

      {loading ? <p className="status">Loading product...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading ? (
        <form className="card form-grid" onSubmit={submit}>
          <input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="number"
            min="0"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <button type="submit">{isEdit ? 'Update Product' : 'Create Product'}</button>
        </form>
      ) : null}
    </section>
  );
}

export default ProductFormPage;

