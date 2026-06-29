import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatPrice, getErrorMessage } from '../utils/helpers';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = { name, email };
      if (password) payload.password = password;
      await updateProfile(payload);
      setMessage('Profile updated successfully');
      setPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="page container profile-page">
      <h1>My Profile</h1>

      <div className="profile-layout">
        <form className="profile-form" onSubmit={handleSubmit}>
          <h2>Update Profile</h2>
          {message && <Message variant="success">{message}</Message>}
          {error && <Message variant="error">{error}</Message>}

          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            New Password (optional)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </form>

        <section className="order-history">
          <h2>Order History</h2>
          {loadingOrders ? (
            <Loader />
          ) : orders.length === 0 ? (
            <Message variant="info">No orders yet.</Message>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <Link key={order._id} to={`/order/${order._id}`} className="order-card">
                  <div>
                    <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span>{formatPrice(order.totalPrice)}</span>
                    <span className={`status ${order.isPaid ? 'paid' : 'pending'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
