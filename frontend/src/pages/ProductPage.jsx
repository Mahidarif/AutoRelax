import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatPrice, getErrorMessage } from '../utils/helpers';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, review);
      setReviewMsg('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      setReviewMsg(getErrorMessage(err));
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!product) return null;

  return (
    <div className="page container product-page">
      <div className="product-detail">
        <img src={product.image} alt={product.name} className="product-detail-image" />
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-brand">{product.brand}</p>
          <div className="product-rating-lg">
            ★ {product.rating.toFixed(1)} ({product.numReviews} reviews)
          </div>
          <p className="product-price-lg">{formatPrice(product.price)}</p>
          <p>{product.description}</p>
          <p className="stock-status">
            Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </p>

          {product.countInStock > 0 && (
            <div className="add-to-cart">
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="reviews-section">
        <h2>Reviews</h2>
        {product.reviews?.length === 0 && <p>No reviews yet.</p>}
        {product.reviews?.map((r) => (
          <div key={r._id} className="review-card">
            <strong>{r.name}</strong>
            <span>★ {r.rating}</span>
            <p>{r.comment}</p>
          </div>
        ))}

        {user && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h3>Write a Review</h3>
            {reviewMsg && <Message variant="info">{reviewMsg}</Message>}
            <label>
              Rating
              <select
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Stars
                  </option>
                ))}
              </select>
            </label>
            <label>
              Comment
              <textarea
                required
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default ProductPage;
