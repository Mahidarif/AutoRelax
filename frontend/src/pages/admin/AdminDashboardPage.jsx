import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminHeader from '../../components/AdminHeader';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: 'spring', stiffness: 100, damping: 15 } }),
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, r] = await Promise.all([api.get('/admin/stats'), api.get('/admin/reports')]);
        setStats(s.data);
        setReports(r.data);
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  const statCards = stats ? [
    { label: 'Total Sales', value: formatPrice(stats.totalSales), cls: 'sales', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
    { label: 'Total Purchase', value: formatPrice(stats.totalPurchases), cls: 'purchase', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg> },
    { label: 'Total Expenses', value: formatPrice(stats.totalExpenses), cls: 'expenses', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14l6-6M4 4h16v16H4z"/></svg> },
    { label: 'Invoice Due', value: formatPrice(stats.invoiceDue), cls: 'invoice', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg> },
  ] : [];

  const pieData = stats ? [
    { name: 'Sales', value: stats.totalSales || 1 },
    { name: 'Expenses', value: stats.totalExpenses || 1 },
    { name: 'Due', value: stats.invoiceDue || 1 },
  ] : [];
  const PIE_COLORS = ['#10B981', '#EF4444', '#e8721b'];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="admin-content">
        {/* Stat Cards */}
        <div className="admin-stats-grid">
          {statCards.map((c, i) => (
            <motion.div key={c.label} className="admin-stat-card" custom={i} initial="hidden" animate="visible" variants={cardVariants}>
              <div className={`admin-stat-icon ${c.cls}`}>{c.icon}</div>
              <div>
                <div className="admin-stat-label">{c.label}</div>
                <div className="admin-stat-value">{c.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="admin-charts-grid">
          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="admin-chart-title">Monthly Revenue</div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={reports?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="admin-chart-title">Revenue Breakdown</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {pieData.map((item, i) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--admin-text-muted)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: PIE_COLORS[i], display: 'inline-block' }}></span>
                  <span>{item.name}: <strong style={{ color: 'var(--admin-text)' }}>{formatPrice(item.value)}</strong></span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
