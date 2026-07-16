import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';
import { formatPrice, getErrorMessage } from '../utils/helpers';
import AskMeBanner from '../components/AskMeBanner';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('Card Payment');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });
  const [jazzcashNumber, setJazzcashNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get('payment');
  const paymentMessage = queryParams.get('message');

  const shipping = shippingOption => (shippingOption === 'pickup' ? 0 : 250);
  const [shippingOption, setShippingOption] = useState(() => {
    return localStorage.getItem('shippingOption') || 'delivery';
  });

  const total = cartTotal + shipping(shippingOption);

  useEffect(() => {
    localStorage.setItem('shippingOption', shippingOption);
  }, [shippingOption]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (paymentMethod === 'Card Payment') {
        setShowOtpModal(true);
        setLoading(false);
        return;
      }

      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        shippingOption,
      };

      if (paymentMethod === 'Jazzcash payment') {
        const { data: initData } = await api.post('/payments/jazzcash/initiate', {
          orderData,
        });

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = initData.postUrl;

        Object.keys(initData.fields).forEach((key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = initData.fields[key];
          form.appendChild(input);
        });

        clearCart();
        document.body.appendChild(form);
        form.submit();
        return;
      }

      // For Cash on Delivery
      const { data: order } = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

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
        paymentMethod,
        shippingOption,
      });

      await api.put(`/orders/${order._id}/pay`, {
        id: `demo-${Date.now()}`,
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: user?.email || 'guest@autorelax.com',
        details: `Card ending in ${cardDetails.number.slice(-4)}`,
      });

      setShowOtpModal(false);
      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err) {
      setOtpError(getErrorMessage(err));
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="page container checkout-page">
      <h1>Checkout</h1>
      {error && <Message variant="error">{error}</Message>}
      {paymentStatus === 'failed' && (
        <Message variant="error">Payment failed: {paymentMessage || 'Transaction was cancelled or declined.'}</Message>
      )}

      <form className="checkout-form" onSubmit={handleSubmit}>
        <section className="checkout-section">
          <h2>Shipping Address</h2>
          <label>
            Full Name
            <input
              required
              type="text"
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
            />
          </label>
          <label>
            Email Address
            <input
              required
              type="email"
              value={shippingAddress.email}
              onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
            />
          </label>
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

        <section className="checkout-section">
          <h2>Payment Method</h2>
          <div className="payment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
            <div
              className={`payment-card ${paymentMethod === 'Card Payment' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('Card Payment')}
              style={{
                border: paymentMethod === 'Card Payment' ? '2px solid #e8721b' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                backgroundColor: paymentMethod === 'Card Payment' ? 'rgba(232, 114, 27, 0.04)' : '#ffffff',
                transition: 'all 0.2s ease-in-out',
                boxShadow: paymentMethod === 'Card Payment' ? '0 4px 12px rgba(232, 114, 27, 0.1)' : 'none',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'Card Payment' ? '#e8721b' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <span style={{ fontWeight: '600', color: paymentMethod === 'Card Payment' ? '#e8721b' : '#334155', fontSize: '0.95rem' }}>Card Payment</span>
            </div>

            <div
              className={`payment-card ${paymentMethod === 'Jazzcash payment' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('Jazzcash payment')}
              style={{
                border: paymentMethod === 'Jazzcash payment' ? '2px solid #e8721b' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                backgroundColor: paymentMethod === 'Jazzcash payment' ? 'rgba(232, 114, 27, 0.04)' : '#ffffff',
                transition: 'all 0.2s ease-in-out',
                boxShadow: paymentMethod === 'Jazzcash payment' ? '0 4px 12px rgba(232, 114, 27, 0.1)' : 'none',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'Jazzcash payment' ? '#e8721b' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
              <span style={{ fontWeight: '600', color: paymentMethod === 'Jazzcash payment' ? '#e8721b' : '#334155', fontSize: '0.95rem' }}>JazzCash</span>
            </div>

            <div
              className={`payment-card ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('Cash on Delivery')}
              style={{
                border: paymentMethod === 'Cash on Delivery' ? '2px solid #e8721b' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                backgroundColor: paymentMethod === 'Cash on Delivery' ? 'rgba(232, 114, 27, 0.04)' : '#ffffff',
                transition: 'all 0.2s ease-in-out',
                boxShadow: paymentMethod === 'Cash on Delivery' ? '0 4px 12px rgba(232, 114, 27, 0.1)' : 'none',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                gridColumn: 'span 2',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'Cash on Delivery' ? '#e8721b' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span style={{ fontWeight: '600', color: paymentMethod === 'Cash on Delivery' ? '#e8721b' : '#334155', fontSize: '0.95rem' }}>Cash on Delivery</span>
            </div>
          </div>
          {paymentMethod === 'Card Payment' && (
            <div className="payment-fields-card" style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, color: '#0e3d5b' }}>Card Details</h3>
              <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', color: '#64748b', width: '100%' }}>
                Cardholder Name
                <input
                  required
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', color: '#64748b', width: '100%' }}>
                Card Number
                <input
                  required
                  maxLength="19"
                  placeholder="1234 5678 9101 1121"
                  value={cardDetails.number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setCardDetails({ ...cardDetails, number: val });
                  }}
                  style={{ padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                />
              </label>
              <div style={{ display: 'flex', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
                <label style={{ flex: 1, display: 'grid', gap: '0.4rem', fontSize: '0.9rem', color: '#64748b', width: '100%', boxSizing: 'border-box' }}>
                  Expiry Date
                  <input
                    required
                    maxLength="5"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) {
                        val = val.substring(0, 2) + '/' + val.substring(2, 4);
                      }
                      setCardDetails({ ...cardDetails, expiry: val });
                    }}
                    style={{ padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  />
                </label>
                <label style={{ flex: 1, display: 'grid', gap: '0.4rem', fontSize: '0.9rem', color: '#64748b', width: '100%', boxSizing: 'border-box' }}>
                  CVV / CVC
                  <input
                    required
                    maxLength="3"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                    style={{ padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                  />
                </label>
              </div>
            </div>
          )}

          {paymentMethod === 'Jazzcash payment' && (
            <div className="payment-fields-jazzcash" style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, color: '#0e3d5b' }}>JazzCash Wallet</h3>
              <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', color: '#64748b', width: '100%' }}>
                JazzCash Mobile Account Number
                <input
                  required
                  maxLength="11"
                  placeholder="03001234567"
                  value={jazzcashNumber}
                  onChange={(e) => setJazzcashNumber(e.target.value.replace(/\D/g, ''))}
                  style={{ padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                />
              </label>
            </div>
          )}

          {paymentMethod === 'Cash on Delivery' && (
            <div className="payment-fields-cod" style={{ marginTop: '1.5rem', background: 'rgba(14, 61, 91, 0.04)', padding: '1.25rem', borderRadius: '8px', border: '1px dashed #0e3d5b' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#0e3d5b', fontWeight: '500' }}>
                💵 Pay with cash upon delivery of your products. No online pre-payment required.
              </p>
            </div>
          )}
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
            <span>{shipping(shippingOption) === 0 ? 'FREE' : formatPrice(shipping(shippingOption))}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </aside>
      </form>
      <AskMeBanner className="ask-me-banner" onClick={() => navigate('/contact')} />

      {showOtpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
          }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0e3d5b', margin: '0 0 0.5rem 0', fontWeight: '700' }}>
              🔒 Payment Authentication
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
              Enter the 4-digit OTP code sent to your {paymentMethod === 'Jazzcash payment' ? `JazzCash mobile number (${jazzcashNumber})` : 'registered cardholder mobile number'}.
            </p>
            {otpError && (
              <div style={{
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                color: '#ef4444',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                fontWeight: '500',
                border: '1px solid #fee2e2',
              }}>
                {otpError}
              </div>
            )}
            <form onSubmit={handleVerifyOtp} style={{ display: 'grid', gap: '1.25rem' }}>
              <label style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}>
                One-Time Password (OTP)
                <input
                  required
                  autoFocus
                  type="text"
                  maxLength="4"
                  placeholder="0 0 0 0"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    letterSpacing: '0.5rem',
                    fontWeight: '700',
                    color: '#0e3d5b',
                  }}
                />
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp('');
                    setOtpError('');
                  }}
                  disabled={isVerifying}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: '#e8721b',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Pay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
