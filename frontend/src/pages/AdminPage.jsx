import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatPrice, getErrorMessage } from '../utils/helpers';

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  category: '',
  brand: '',
  image: '',
  countInStock: 0,
};

const AdminPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/orders'),
      ]);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchData();
  }, [user]);

  if (!user?.isAdmin) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'price' || name === 'countInStock' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post('/products', form);
      }
      setForm(emptyProduct);
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      image: product.image,
      countInStock: product.countInStock,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const markDelivered = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="page container admin-page">
      <h1>Admin Dashboard</h1>
      {error && <Message variant="error">{error}</Message>}

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'products' ? 'active' : ''}
          onClick={() => setTab('products')}
        >
          Products
        </button>
        <button
          type="button"
          className={tab === 'orders' ? 'active' : ''}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : tab === 'products' ? (
        <div className="admin-products">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
            <input name="countInStock" type="number" placeholder="Stock" value={form.countInStock} onChange={handleChange} required />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyProduct);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.countInStock}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => handleEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>User</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user?.name}</td>
                <td>{formatPrice(o.totalPrice)}</td>
                <td>{o.isPaid ? 'Yes' : 'No'}</td>
                <td>{o.isDelivered ? 'Yes' : 'No'}</td>
                <td>
                  {!o.isDelivered && o.isPaid && (
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => markDelivered(o._id)}>
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
