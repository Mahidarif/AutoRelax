import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import AdminHeader from '../../components/AdminHeader';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';

const tabs = ['Analysis', 'Profit Report', 'Loss Report', 'Year Profit', 'Year Loss', 'Invoice'];

const AdminReportsPage = () => {
  const [active, setActive] = useState('Analysis');
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get('/admin/reports').then(r => setData(r.data)).catch(console.error);
    api.get('/orders').then(res => {
      setOrders(res.data);
      if (res.data.length > 0) setSelectedOrder(res.data[0]);
    }).catch(console.error);
  }, []);

  const monthly = data?.monthlyData || [];

  return (
    <>
      <AdminHeader title="Reports" />
      <div className="admin-content">
        {/* Sub-tabs */}
        <div className="admin-report-tabs">
          {tabs.map(t => (
            <button key={t} className={`admin-report-tab${active === t ? ' active' : ''}`} onClick={() => setActive(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
          {active === 'Analysis' && (
            <div className="admin-charts-grid">
              <div className="admin-chart-card">
                <div className="admin-chart-title">Weekly Overview</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4,4,0,0]} />
                    <Bar dataKey="expenses" fill="#EF4444" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-chart-card">
                <div className="admin-chart-title">Expenses Report</div>
                <table className="admin-table">
                  <thead>
                    <tr><th>Description</th><th>Amount</th><th>Total</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {(data?.recentExpenses || []).map(e => (
                      <tr key={e._id}>
                        <td>{e.description}</td>
                        <td>{formatPrice(e.amount)}</td>
                        <td>{formatPrice(e.total)}</td>
                        <td>{new Date(e.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'Profit Report' && (
            <div className="admin-chart-card">
              <div className="admin-chart-title">Monthly Profit</div>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip />
                  <Bar dataKey="profit" radius={[4,4,0,0]}>
                    {monthly.map((e, i) => <Cell key={i} fill={e.profit >= 0 ? '#10B981' : '#EF4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {active === 'Loss Report' && (
            <div className="admin-chart-card">
              <div className="admin-chart-title">Monthly Loss</div>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={monthly.map(m => ({ ...m, loss: m.profit < 0 ? Math.abs(m.profit) : 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip />
                  <Bar dataKey="loss" fill="#EF4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {active === 'Year Profit' && (
            <div className="admin-chart-card">
              <div className="admin-chart-title">Yearly Profit Trend — {formatPrice(data?.totalProfit || 0)}</div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {active === 'Year Loss' && (
            <div className="admin-chart-card">
              <div className="admin-chart-title">Yearly Loss Trend</div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={monthly.map(m => ({ ...m, loss: m.profit < 0 ? Math.abs(m.profit) : 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {active === 'Invoice' && (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
              <div className="admin-chart-card">
                <div className="admin-chart-title">Select Order</div>
                <div className="admin-modal-field" style={{ marginBottom: '1.25rem' }}>
                  <label>Order Reference</label>
                  <select 
                    value={selectedOrder?._id || ''} 
                    onChange={e => {
                      const order = orders.find(o => o._id === e.target.value);
                      setSelectedOrder(order);
                    }}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  >
                    {orders.map(o => (
                      <option key={o._id} value={o._id}>
                        {o.user?.name || 'Guest'} - {o._id.slice(-6)} ({formatPrice(o.totalPrice)})
                      </option>
                    ))}
                    {orders.length === 0 && <option value="">No orders found</option>}
                  </select>
                </div>
                {selectedOrder && (
                  <button 
                    type="button" 
                    className="admin-btn-add" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => window.print()}
                  >
                    Print Invoice
                  </button>
                )}
              </div>

              {selectedOrder ? (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[1, 2].map(sheetNum => (
                    <div 
                      key={sheetNum} 
                      className="admin-chart-card" 
                      style={{ 
                        width: '380px', 
                        minHeight: '500px', 
                        padding: '1.5rem', 
                        background: '#fff', 
                        border: '1px solid #e2e8f0',
                        fontSize: '0.8rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0e3d5b' }}>INVOICE</div>
                          <div style={{ color: '#64748B', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                            Order Reference: #{selectedOrder._id.slice(-6)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: '800', color: '#e8721b', fontSize: '1rem' }}>
                          AutoRelax
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0E3D5B', marginBottom: '0.25rem' }}>BILL TO:</div>
                          <div style={{ fontWeight: '600' }}>{selectedOrder.shippingAddress?.address || 'N/A'}</div>
                          <div>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</div>
                          <div style={{ color: '#64748B' }}>{selectedOrder.user?.email || 'Guest Customer'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div><span style={{ fontWeight: '700', color: '#0E3D5B' }}>INVOICE #:</span> {selectedOrder._id.slice(-8)}</div>
                          <div><span style={{ fontWeight: '700', color: '#0E3D5B' }}>INVOICE DATE:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                          <div><span style={{ fontWeight: '700', color: '#0E3D5B' }}>DUE DATE:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                        <thead>
                          <tr style={{ background: '#0E3D5B', color: '#fff' }}>
                            <th style={{ padding: '0.35rem 0.5rem', textAlign: 'left', fontSize: '0.7rem' }}>DESCRIPTION</th>
                            <th style={{ padding: '0.35rem 0.5rem', textAlign: 'right', fontSize: '0.7rem' }}>UNIT COST</th>
                            <th style={{ padding: '0.35rem 0.5rem', textAlign: 'center', fontSize: '0.7rem' }}>QTY</th>
                            <th style={{ padding: '0.35rem 0.5rem', textAlign: 'right', fontSize: '0.7rem' }}>TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.orderItems.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '0.35rem 0.5rem', fontWeight: '600' }}>{item.name}</td>
                              <td style={{ padding: '0.35rem 0.5rem', textAlign: 'right' }}>{formatPrice(item.price)}</td>
                              <td style={{ padding: '0.35rem 0.5rem', textAlign: 'center' }}>{item.qty}</td>
                              <td style={{ padding: '0.35rem 0.5rem', textAlign: 'right', fontWeight: '600' }}>{formatPrice(item.price * item.qty)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0E3D5B', marginBottom: '0.2rem' }}>SPECIAL NOTES:</div>
                          <div style={{ color: '#64748B', fontSize: '0.7rem', lineHeight: '1.2' }}>
                            Payment via {selectedOrder.paymentMethod}.<br />
                            Shipping: {selectedOrder.shippingPrice > 0 ? 'Delivery with charges' : 'Self pick-up'}.
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <span style={{ color: '#64748B' }}>SUB TOTAL:</span>
                            <span>{formatPrice(selectedOrder.itemsPrice)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <span style={{ color: '#64748B' }}>SHIPPING:</span>
                            <span>{formatPrice(selectedOrder.shippingPrice)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0E3D5B', paddingTop: '0.2rem', fontWeight: '800', color: '#0E3D5B' }}>
                            <span>AMOUNT DUE:</span>
                            <span>{formatPrice(selectedOrder.totalPrice)}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B' }}>
                        <div>
                          <span style={{ fontWeight: '700', color: '#0E3D5B' }}>BILLED FROM:</span> AutoRelax, Lahore, Pakistan
                        </div>
                        <div style={{ fontWeight: '700', color: '#e8721b' }}>THANK YOU</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-chart-card" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                  No order selected or available.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AdminReportsPage;
