import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';
import { formatPrice, getErrorMessage } from '../utils/helpers';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tax = Number((cartTotal * 0.1).toFixed(2));
  const shipping = cartTotal > 100 ? 0 : 10;
  const total = cartTotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      }));

      const { data: order } = await api.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
      });

      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page container checkout-page">
      <h1>Checkout</h1>
      {error && <Message variant="error">{error}</Message>}

      <form className="checkout-form" onSubmit={handleSubmit}>
        <section className="checkout-section">
          <h2>Shipping Address</h2>
          <label>
            Address
            <input
              required
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
            />
          </label>
          <label>
            City
            <input
              required
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            />
          </label>
          <label>
            Postal Code
            <input
              required
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
              }
            />
          </label>
          <label>
            Country
            <input
              required
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
            />
          </label>
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="summary-row">
              <span>
                {item.name} x {item.qty}
              </span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default CheckoutPage;
