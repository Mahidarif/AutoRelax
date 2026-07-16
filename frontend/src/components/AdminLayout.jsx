import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../context/AuthContext';
import '../admin.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        navigate('/admin/login', { state: { message: 'Session expired due to inactivity.' } });
      }, 15 * 60 * 1000);
    };

    resetTimer();

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [logout, navigate]);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="admin-main-wrapper">
        <Outlet context={{ isSidebarOpen, setIsSidebarOpen }} />
      </div>
    </div>
  );
};

export default AdminLayout;
