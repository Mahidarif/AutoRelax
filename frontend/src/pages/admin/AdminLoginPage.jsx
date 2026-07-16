import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import '../../admin.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const flashMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (!data.isAdmin) {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Left Visual */}
      <motion.div
        className="admin-login-visual"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ textAlign: 'center' }}
        >
          <svg width="280" height="280" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" fill="rgba(232,114,27,0.15)"/>
            <circle cx="100" cy="100" r="60" fill="rgba(232,114,27,0.25)"/>
            <circle cx="100" cy="100" r="30" fill="#e8721b"/>
            <text x="100" y="108" textAnchor="middle" fill="#fff" fontWeight="900" fontSize="18">AR</text>
          </svg>
          <p style={{ color: '#8A99AF', marginTop: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>
            Admin Control Panel
          </p>
        </motion.div>
      </motion.div>

      {/* Right Form */}
      <motion.div
        className="admin-login-form-side"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.15 }}
      >
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-logo">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e8721b', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>AR</div>
            <span>AutoRelax</span>
          </div>

          <h2>Admin Login</h2>

          {flashMessage && (
            <div className="admin-login-flash" style={{ padding: '0.65rem 1rem', background: 'rgba(232, 114, 27, 0.1)', color: '#e8721b', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
              {flashMessage}
            </div>
          )}

          {error && <div className="admin-login-error">{error}</div>}

          <div className="admin-login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@autorelax.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-login-field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748B'
                }}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="admin-login-options">
            <label>
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <motion.button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
