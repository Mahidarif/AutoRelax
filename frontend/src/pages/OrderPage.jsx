import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatPrice, getErrorMessage } from '../utils/helpers';

const OrderPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const paymentStatus = searchParams.get('payment');
  const paymentMessage = searchParams.get('message');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!order) return null;

  return (
    <div className="page container order-page">
      <h1>Order Confirmation</h1>
      
      {paymentStatus === 'success' ? (
        <Message variant="success">Payment succeeded! Thank you for your purchase.</Message>
      ) : paymentStatus === 'failed' ? (
        <Message variant="error">Payment failed: {paymentMessage || 'Transaction was declined.'}</Message>
      ) : (
        <Message variant="success">Thank you! Your order has been placed.</Message>
      )}

      <div className="order-detail">
        <section>
          <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
          <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>
          <p>Payment Method: {order.paymentMethod}</p>
          <p>Payment Status: {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : 'Pending'}</p>
          <p>Delivery: {order.isDelivered ? 'Delivered' : 'Not delivered yet'}</p>
        </section>

        <section>
          <h3>Items</h3>
          {order.orderItems.map((item) => (
            <div key={item._id} className="order-item">
              <img src={item.image} alt={item.name} />
              <div>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <p>
                  {item.qty} x {formatPrice(item.price)} = {formatPrice(item.qty * item.price)}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h3>Shipping & Customer Details</h3>
          <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
          <p><strong>Email:</strong> {order.shippingAddress.email}</p>
          <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        </section>

        <aside className="cart-summary">
          <div className="summary-row">
            <span>Items</span>
            <span>{formatPrice(order.itemsPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </aside>
      </div>

      <Link to="/" className="btn btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderPage;
