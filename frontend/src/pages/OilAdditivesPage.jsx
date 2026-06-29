import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SortBy from '../components/SortBy';
import SearchProducts from '../components/SearchProducts';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';

const OilAdditivesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const subcategories = [
    'Engine Oil',
    'Transmission Fluid',
    'Coolant',
    'Power Steering Fluid',
    'Brake Fluid'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ 
          page,
          category: 'Oil & Additives'
        });
        if (subcategory) params.append('keyword', subcategory);

        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products);
        setPages(data.pages);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategory, page]);

  // Mock products for frontend display
  const mockProducts = [
    { _id: '1', name: 'Premium Engine Oil 5W-30', price: 4500, countInStock: 10 },
    { _id: '2', name: 'Synthetic Motor Oil', price: 5200, countInStock: 8 },
    { _id: '3', name: 'Diesel Engine Oil', price: 3800, countInStock: 15 },
    { _id: '4', name: 'Power Steering Fluid', price: 2200, countInStock: 20 },
    { _id: '5', name: 'Brake Fluid DOT 3', price: 1800, countInStock: 25 },
    { _id: '6', name: 'Engine Oil Additive', price: 1500, countInStock: 30 },
    { _id: '7', name: 'Fuel System Cleaner', price: 1200, countInStock: 40 },
    { _id: '8', name: 'Oil Treatment', price: 950, countInStock: 35 },
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
      {/* Products Section */}
      <section className="container shop-section">
        <h2 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#0e3d5b', marginBottom: '2rem', textAlign: 'center' }}>
          Our Selection
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <SortBy value={sortBy} onChange={setSortBy} />
          <SearchProducts value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="filters">
          <button
            type="button"
            className={`filter-btn ${!subcategory ? 'active' : ''}`}
            onClick={() => {
              setSubcategory('');
              setPage(1);
            }}
          >
            All Products
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub}
              type="button"
              className={`filter-btn ${subcategory === sub ? 'active' : ''}`}
              onClick={() => {
                setSubcategory(sub);
                setPage(1);
              }}
            >
              {sub}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : sortedProducts.length === 0 ? (
          <Message variant="info">No products found in this category.</Message>
        ) : (
          <>
            <div className="product-grid">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {pages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {pages}
                </span>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default OilAdditivesPage;
