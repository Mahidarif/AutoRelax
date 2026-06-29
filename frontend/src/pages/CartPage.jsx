import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import Message from '../components/Message';

const CartPage = () => {
  const { cartItems, updateQty, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const tax = cartTotal ? Number((cartTotal * 0.1).toFixed(2)) : 0;
  const shipping = cartTotal > 100 ? 0 : cartTotal > 0 ? 10 : 0;
  const total = cartTotal ? cartTotal + tax + shipping : 0;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="page container">
        <Message variant="info">Your cart is empty.</Message>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
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
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#f4f4f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ccc'
                }}>
                  No Image
                </div>
              )}
              <div className="cart-item-info">
                <Link to={`/product/${item._id}`}>{item.name}</Link>
                <p>{formatPrice(item.price)}</p>
              </div>
              <select
                value={item.qty}
                onChange={(e) => updateQty(item._id, Number(e.target.value))}
              >
                {[...Array(Math.min(item.countInStock || 10, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
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
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>{formatPrice(tax)}</span>
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
    </div>
  );
};

export default CartPage;
