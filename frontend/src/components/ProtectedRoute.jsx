import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const isTokenExpired = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded && decoded.exp ? decoded.exp * 1000 < Date.now() : true;
  } catch (e) {
    return true;
  }
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#F1F5F9', color: '#1C2434', fontWeight: 600 }}>Loading...</div>;
  }

  if (!user || (user.token && isTokenExpired(user.token))) {
    if (user) logout();
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
