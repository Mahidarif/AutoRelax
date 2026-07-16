import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminHeader = ({ title }) => {
  const { user } = useAuth();
  const { setIsSidebarOpen } = useOutletContext() || {};
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'A';

  return (
    <header className="admin-header">
      <button className="admin-sidebar-toggle" onClick={() => setIsSidebarOpen?.(true)} aria-label="Open sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="admin-header-title">{title}</h1>
      <div className="admin-header-actions">
        <button className="admin-header-bell" aria-label="Notifications">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="admin-header-bell-badge" />
        </button>
        <div className="admin-header-avatar">{initials}</div>
      </div>
    </header>
  );
};

export default AdminHeader;
