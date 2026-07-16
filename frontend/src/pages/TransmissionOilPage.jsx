import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SortBy from '../components/SortBy';
import SearchProducts from '../components/SearchProducts';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';
import AskMeBanner from '../components/AskMeBanner';

const TransmissionOilPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products?category=Transmission Oil');
        setProducts(data.products || []);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'oldest':
        return a._id.localeCompare(b._id);
      case 'recent':
      default:
        return b._id.localeCompare(a._id);
    }
  });

  return (
    <div className="page">
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#0e3d5b', marginBottom: '2rem', textAlign: 'center' }}>
            Transmission Oil
          </h1>
          <div className="shop-controls">
            <SortBy value={sortBy} onChange={setSortBy} />
            <SearchProducts value={searchQuery} onChange={setSearchQuery} />
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : sortedProducts.length === 0 ? (
            <Message variant="info">No transmission oil products found.</Message>
          ) : (
            <div className="product-grid">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <AskMeBanner className="ask-me-banner" onClick={() => navigate('/contact')} />
    </div>
  );
};

export default TransmissionOilPage;
