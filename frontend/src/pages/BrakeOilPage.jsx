import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SortBy from '../components/SortBy';
import SearchProducts from '../components/SearchProducts';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';

// Import images for mock data
import brakeOil1 from '../assests/images/brakeOil1.jpg';
import brakeOil2 from '../assests/images/brakeOil2.jpg';
import brakeOil3 from '../assests/images/brakeOil3.jpg';
import brakeOil4 from '../assests/images/brakeOil4.jpg';
import brakeOil5 from '../assests/images/brakeOil5.jpg';
import brakeOil6 from '../assests/images/brakeOil6.jpg';

const BrakeOilPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products?category=brake-oil');
        // Add a fallback image for each product if not provided by backend
        const productsWithImages = (data.products || []).map((product, idx) => ({
          ...product,
          image:
            product.image ||
            [brakeOil1, brakeOil2, brakeOil3, brakeOil4][idx % 4], // assign images in order if no `image`
        }));
        setProducts(productsWithImages);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mock products for frontend display with images included
  const mockProducts = [
    { _id: '1', name: 'Brakes Oils of Royal Purple', price: 2500, image: brakeOil1, countInStock: 10 },
    { _id: '2', name: 'Break-N40 WT', price: 3200, image: brakeOil2, countInStock: 15 },
    { _id: '3', name: 'DOT 4 Brake Fluid', price: 1800, image: brakeOil3, countInStock: 20 },
    { _id: '4', name: 'Synthetic Brake Oil', price: 4500, image: brakeOil4, countInStock: 8 },
    { _id: '5', name: 'Premium Brake Fluid', price: 2100, image: brakeOil5, countInStock: 12 },
    { _id: '6', name: 'Heavy Duty Brake Oil', price: 3800, image: brakeOil6, countInStock: 10 },
  ];

  // Use images from products, or mock images, so ProductCard always receives `product.image`
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
            Brake Oil
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
            <Message variant="info">No brake oil products found.</Message>
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

export default BrakeOilPage;
