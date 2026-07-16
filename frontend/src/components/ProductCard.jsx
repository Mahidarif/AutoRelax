import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const cartIconRef = useRef(null);

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleIncrement = () => {
    const cartItem = cartItems.find(item => item._id === product._id);
    if (cartItem) {
      updateQty(product._id, cartItem.qty + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleDecrement = () => {
    const cartItem = cartItems.find(item => item._id === product._id);
    if (cartItem) {
      if (cartItem.qty > 1) {
        updateQty(product._id, cartItem.qty - 1);
      } else {
        removeFromCart(product._id);
      }
    }
  };

  const cartItem = cartItems.find(item => item._id === product._id);
  const cartQuantity = cartItem ? cartItem.qty : 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartIconRef.current && !cartIconRef.current.contains(event.target)) {
        setShowQuantitySelector(false);
      }
    };

    if (showQuantitySelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuantitySelector]);

  return (
  <article style={{
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    position: 'relative',
    width: '322px',
    height: '370px',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <div style={{ position: 'relative', height: '260px', background: '#f4f4f4', flexShrink: 0 }}>
      <Link to={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          // Blank image area - fallback if no image
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ccc'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </Link>
      <div ref={cartIconRef}>
        <button
          onClick={() => setShowQuantitySelector(!showQuantitySelector)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '8px',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'background 0.2s ease'
          }}
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {cartQuantity > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#e8721b',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: '700',
            minWidth: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px'
          }}>
            {cartQuantity}
          </span>
        )}
      </button>
      
      {showQuantitySelector && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          minWidth: '120px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <button
              onClick={handleDecrement}
              style={{
                width: '24px',
                height: '24px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              -
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
              {cartQuantity}
            </span>
            <button
              onClick={handleIncrement}
              style={{
                width: '24px',
                height: '24px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
    <div style={{ padding: '1rem', height: '110px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0e3d5b', marginBottom: '0.25rem', margin: 0, lineHeight: '1.2' }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {product.name}
        </Link>
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
        <div>
          <p style={{ fontSize: '1rem', fontWeight: '700', color: '#e8721b', margin: 0, marginBottom: '0.25rem' }}>
            {formatPrice(product.price)}
          </p>
          <p style={{ fontSize: '1rem', color: '#16a34a', fontWeight: '500', margin: 0 }}>
            In Stock
          </p>
        </div>
        <button
          onClick={handleBuyNow}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#e8721b',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            marginTop: '0.1rem'
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  </article>
  );
};

export default ProductCard;
