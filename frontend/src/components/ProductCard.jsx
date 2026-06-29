import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(1);
  const quantitySelectorRef = useRef(null);
  
  // Close the quantity selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (quantitySelectorRef.current && !quantitySelectorRef.current.contains(event.target)) {
        setShowQuantitySelector(false);
      }
    }
    
    if (showQuantitySelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuantitySelector]);

  const handleAddToCart = () => {
    // Only add to cart if the item is not already in the cart or if quantity is different
    const cartItem = cartItems.find(item => item._id === product._id);
    if (!cartItem || cartItem.qty !== localQuantity) {
      addToCart(product, localQuantity);
    }
    setShowQuantitySelector(false);
  };

  const handleBuyNow = () => {
    addToCart(product, localQuantity);
    navigate('/checkout');
  };

  const handleIncrement = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    // Update the cart quantity if the item is already in the cart
    if (cartQuantity > 0) {
      updateQty(product._id, newQuantity);
    }
  };

  const handleDecrement = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      // Update the cart quantity if the item is already in the cart
      if (cartQuantity > 0) {
        updateQty(product._id, newQuantity);
      }
    } else if (localQuantity === 1 && cartQuantity > 0) {
      // If quantity is 1 and item is in cart, remove it from cart
      removeFromCart(product._id);
      setLocalQuantity(1);
    }
  };

  // Get quantity of this product in cart
  const cartItem = cartItems.find(item => item._id === product._id);
  const cartQuantity = cartItem ? cartItem.qty : 0;
  
  // Initialize localQuantity with cart quantity if it exists, otherwise default to 1
  useEffect(() => {
    if (cartQuantity > 0) {
      setLocalQuantity(cartQuantity);
    } else {
      setLocalQuantity(1);
    }
  }, [cartQuantity, product._id]);

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
        
        {/* Floating Cart Icon */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }} ref={quantitySelectorRef}>
          <button
            onClick={() => setShowQuantitySelector(!showQuantitySelector)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffffff',
              color: '#e8721b',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              padding: 0
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
                top: '-2px',
                right: '-2px',
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
                padding: '0 4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}>
                {cartQuantity}
              </span>
            )}
          </button>
          
          {showQuantitySelector && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 100,
              minWidth: '140px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <button
                  onClick={handleDecrement}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '1rem', fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>
                  {localQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1.1rem',
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
              <button
                onClick={handleAddToCart}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '8px',
                  background: '#e8721b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '1rem', height: '110px', display: 'flex', flexDirection: 'column' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0e3d5b', marginBottom: '0.25rem', margin: 0, lineHeight: '1.2' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#e8721b', marginBottom: '0.25rem', margin: 0 }}>
            PKR{formatPrice(product.price)}
          </p>
          <p style={{ fontSize: '1rem', color: '#16a34a', fontWeight: '700', margin: 0 }}>
            In Stock
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            onClick={handleBuyNow}
            style={{
              marginTop: '-5rem',
              marginRight: '1rem',
              padding: '0.8rem 1.5rem',
              background: '#e8721b',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
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
