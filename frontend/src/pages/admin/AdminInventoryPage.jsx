import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminHeader from '../../components/AdminHeader';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';

const statusPill = s => {
  const cls = s === 'In Stock' ? 'in-stock' : s === 'Low Stock' ? 'low-stock' : 'out-of-stock';
  return <span className={`admin-pill ${cls}`}>{s}</span>;
};

const emptyProduct = { name: '', price: '', purchasePrice: '', category: '', brand: '', image: '', countInStock: '', description: '' };

const AdminInventoryPage = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState(['Oil Additives', 'Brake Oil', 'Coolants', 'Transmission Oil']);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCat, setShowCustomCat] = useState(false);

  const fetchInventory = async () => {
    try {
      const { data } = await api.get(`/admin/inventory?keyword=${search}`);
      setItems(data.items);
      setSummary(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchInventory();
  }, [search]);

  // Fetch unique categories from DB on mount
  useEffect(() => {
    api.get('/products').then(res => {
      const dbCategories = [...new Set(res.data.map(p => p.category))].filter(Boolean);
      setCategories(prev => [...new Set([...prev, ...dbCategories])]);
    }).catch(console.error);
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyProduct);
    setCustomCategory('');
    setShowCustomCat(false);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      price: item.price,
      purchasePrice: item.purchasePrice || '',
      category: item.category,
      brand: item.brand,
      image: item.image,
      countInStock: item.countInStock,
      description: item.description || '',
    });
    setCustomCategory('');
    setShowCustomCat(false);
    setShowModal(true);
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const finalCategory = showCustomCat ? customCategory : form.category;
    const finalForm = { 
      ...form, 
      category: finalCategory, 
      price: Number(form.price), 
      purchasePrice: Number(form.purchasePrice),
      countInStock: Number(form.countInStock) 
    };
    try {
      if (editItem) {
        await api.put(`/products/${editItem._id}`, finalForm);
      } else {
        await api.post('/products', finalForm);
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) { alert(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchInventory();
    } catch (e) { console.error(e); }
  };

  const statCards = [
    { label: 'Total Items', value: summary.totalItems || 0, cls: 'purchase' },
    { label: 'Low Stock Items', value: summary.lowStockItems || 0, cls: 'invoice' },
    { label: 'Out of Stock Items', value: summary.outOfStockItems || 0, cls: 'expenses' },
    { label: 'In Stock Items', value: summary.inStockItems || 0, cls: 'sales' },
  ];

  return (
    <>
      <AdminHeader title="Inventory" />
      <div className="admin-content">
        {/* Stat Cards */}
        <div className="admin-stats-grid">
          {statCards.map((c, i) => (
            <motion.div key={c.label} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}>
              <div className={`admin-stat-icon ${c.cls}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <div>
                <div className="admin-stat-label">{c.label}</div>
                <div className="admin-stat-value">{c.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Add */}
        <div className="admin-table-header">
          <div className="admin-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="admin-btn-add" onClick={openAdd}>+ Add Items</button>
        </div>

        {/* Table */}
        <motion.div className="admin-table-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Image</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Purchase Cost</th>
                <th>Retail Price</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td><img src={item.image} alt="" className="admin-table-img" /></td>
                  <td>{item.category}</td>
                  <td>{item.countInStock}</td>
                  <td>{formatPrice(item.purchasePrice || 0)}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                  <td>{statusPill(item.status)}</td>
                  <td style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="admin-action-btn" title="Edit" onClick={() => openEdit(item)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="admin-action-btn delete" title="Delete" onClick={() => handleDelete(item._id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>No items found</td></tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <motion.div className="admin-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} onClick={e => e.stopPropagation()}>
                <h2>{editItem ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSave}>
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
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                      rows="3"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="admin-btn-add" disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Add Product'}</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminInventoryPage;
