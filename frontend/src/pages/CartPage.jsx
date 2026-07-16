import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import Message from '../components/Message';
import AskMeBanner from '../components/AskMeBanner';

const CartPage = () => {
  const { cartItems, updateQty, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingOption, setShippingOption] = useState(() => {
    return localStorage.getItem('shippingOption') || 'delivery';
  });

  const shipping = shippingOption === 'pickup' ? 0 : 250;
  const total = cartTotal + shipping;

  useEffect(() => {
    localStorage.setItem('shippingOption', shippingOption);
  }, [shippingOption]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="page container">
        <Message variant="info">Your cart is empty.</Message>
        <Link to="/" className="btn btn-primary" style={{ marginBottom: '2rem' }}>
          Continue Shopping
        </Link>
        <AskMeBanner className="ask-me-banner" onClick={() => navigate('/contact')} />
      </div>
    );
  }

  return (
    <div className="page container cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/product/${item._id}`}>{item.name}</Link>
                <p>{formatPrice(item.price)}</p>
              </div>
              <div className="detail-qty-selector">
                <button 
                  type="button" 
                  className="detail-qty-btn"
                  onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                  disabled={item.qty <= 1}
                >
                  −
                </button>
                <input 
                  type="number" 
                  className="detail-qty-input"
                  value={item.qty}
                  readOnly
                />
                <button 
                  type="button" 
                  className="detail-qty-btn"
                  onClick={() => updateQty(item._id, Math.min(Number(item.countInStock) || 10, item.qty + 1))}
                  disabled={item.qty >= (Number(item.countInStock) || 10)}
                >
                  +
                </button>
              </div>
              <p className="cart-item-total">{formatPrice(item.price * item.qty)}</p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <div className="shipping-options" style={{ margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '1rem 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: '#0e3d5b', cursor: 'pointer', fontWeight: '500' }}>
              <input 
                type="radio" 
                name="shippingOption" 
                value="delivery" 
                checked={shippingOption === 'delivery'}
                onChange={() => setShippingOption('delivery')}
                style={{ accentColor: '#e8721b' }}
              />
              Delivery (with Charges)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: '#0e3d5b', cursor: 'pointer', fontWeight: '500' }}>
              <input 
                type="radio" 
                name="shippingOption" 
                value="pickup" 
                checked={shippingOption === 'pickup'}
                onChange={() => setShippingOption('pickup')}
                style={{ accentColor: '#e8721b' }}
              />
              Self Pick-up (from Warehouse)
            </label>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
      <AskMeBanner className="ask-me-banner" onClick={() => navigate('/contact')} />
    </div>
  );
};

export default CartPage;
