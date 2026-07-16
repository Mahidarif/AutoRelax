import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../../components/AdminHeader';
import api from '../../utils/api';

const AdminAddProductPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', purchasePrice: '', category: '', brand: '', image: '', countInStock: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [categories, setCategories] = useState(['Oil Additives', 'Brake Oil', 'Coolants', 'Transmission Oil']);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCat, setShowCustomCat] = useState(false);

  // Fetch unique categories from DB on mount
  useEffect(() => {
    api.get('/products').then(res => {
      const dbCategories = [...new Set(res.data.map(p => p.category))].filter(Boolean);
      setCategories(prev => [...new Set([...prev, ...dbCategories])]);
    }).catch(console.error);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const finalCategory = showCustomCat ? customCategory : form.category;
    const finalForm = { 
      ...form, 
      category: finalCategory, 
      price: Number(form.price), 
      purchasePrice: Number(form.purchasePrice),
      countInStock: Number(form.countInStock) 
    };
    try {
      await api.post('/products', finalForm);
      navigate('/admin/inventory');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally { setSaving(false); }
  };

  return (
    <>
      <AdminHeader title="Add Product" />
      <div className="admin-content">
        <motion.div className="admin-chart-card" style={{ maxWidth: 600 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100 }}>
          <div className="admin-chart-title">New Product</div>
          {error && <div className="admin-login-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="admin-modal-field">
              <label>Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="admin-modal-field">
              <label>Purchase Price (Rs.)</label>
              <input
                type="number"
                value={form.purchasePrice}
                onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
                required
              />
            </div>

            <div className="admin-modal-field">
              <label>Retail Price (Rs.)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div className="admin-modal-field">
              <label>Category</label>
              <select
                value={showCustomCat ? 'custom' : form.category}
                onChange={e => {
                  if (e.target.value === 'custom') {
                    setShowCustomCat(true);
                    setForm({ ...form, category: '' });
                  } else {
                    setShowCustomCat(false);
                    setForm({ ...form, category: e.target.value });
                  }
                }}
                required={!showCustomCat}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">+ Add New Category...</option>
              </select>
            </div>

            {showCustomCat && (
              <div className="admin-modal-field" style={{ marginTop: '0.5rem' }}>
                <label>New Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="admin-modal-field">
              <label>Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={e => setForm({ ...form, brand: e.target.value })}
              />
            </div>

            <div className="admin-modal-field">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={form.countInStock}
                onChange={e => setForm({ ...form, countInStock: e.target.value })}
                required
              />
            </div>

            <div className="admin-modal-field">
              <label>Upload Image from PC</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ border: 'none', padding: 0 }}
                />
                {form.image && (
                  <img 
                    src={form.image} 
                    alt="Preview" 
                    style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #E2E8F0' }} 
                  />
                )}
              </div>
            </div>

            <div className="admin-modal-field">
              <label>Description</label>
              <textarea
                rows="4"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="admin-modal-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/inventory')}>Cancel</button>
              <button type="submit" className="admin-btn-add" disabled={saving}>{saving ? 'Saving...' : 'Create Product'}</button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default AdminAddProductPage;
