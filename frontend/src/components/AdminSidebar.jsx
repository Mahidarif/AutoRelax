import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { section: 'Main', items: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { to: '/admin/inventory', label: 'Inventory', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg> },
    { to: '/admin/add-product', label: 'Add Product', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg> },
    { to: '/admin/reports', label: 'Reports', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
  ]},
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      <div className={`admin-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <img src="/logo.png" alt="AutoRelax" onError={e => { e.target.style.display = 'none'; }} />
          <span>AutoRelax</span>
          <button className="admin-sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      {links.map(s => (
        <div key={s.section} className="admin-sidebar-section">
          <div className="admin-sidebar-section-title">{s.section}</div>
          {s.items.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="admin-sidebar-section" style={{ marginTop: 'auto' }}>
        <div className="admin-sidebar-section-title">Account</div>
        <div className="admin-sidebar-link" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Logout
        </div>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;
