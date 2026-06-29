import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SortBy from '../components/SortBy';
import SearchProducts from '../components/SearchProducts';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';

const TransmissionOilPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products?category=transmission-oil');
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

  // Mock products for frontend display
  const mockProducts = [
    { _id: '1', name: 'ATF Type F Transmission Fluid', price: 3500, countInStock: 10 },
    { _id: '2', name: 'Synthetic Transmission Oil', price: 4800, countInStock: 8 },
    { _id: '3', name: 'CVT Transmission Fluid', price: 4200, countInStock: 15 },
    { _id: '4', name: 'Dual Clutch Transmission Oil', price: 5500, countInStock: 6 },
    { _id: '5', name: 'Manual Transmission Oil', price: 2900, countInStock: 20 },
    { _id: '6', name: 'Automatic Transmission Fluid', price: 3800, countInStock: 12 },
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  // Filter products based on search query
  const filteredProducts = displayProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort products based on sort option
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
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
    </div>
  );
};

export default TransmissionOilPage;
