import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SortBy from '../components/SortBy';
import SearchProducts from '../components/SearchProducts';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';
import AskMeBanner from '../components/AskMeBanner';


const OilAdditivesPage = () => {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolve selected category from URL param
  const activeCategory = urlCategory ? decodeURIComponent(urlCategory) : '';

  // Helper to map route categories to normalized values
  const getNormalizedCategory = (routeVal) => {
    if (!routeVal) return '';
    const lower = routeVal.toLowerCase();
    if (lower === 'brake-oil' || lower === 'brake oil') return 'Brake Oil';
    if (lower === 'coolants') return 'Coolants';
    if (lower === 'transmission-oil' || lower === 'transmission oil') return 'Transmission Oil';
    return routeVal;
  };

  const selectedCategory = getNormalizedCategory(activeCategory);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data.filter(Boolean));
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when selected category or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page });
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }

        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, page]);

  const handleCategoryClick = (cat) => {
    if (!cat) {
      navigate('/oil-additives');
    } else {
      const lower = cat.toLowerCase();
      if (lower === 'brake oil') {
        navigate('/oil-additives/brake-oil');
      } else if (lower === 'coolants') {
        navigate('/oil-additives/coolants');
      } else if (lower === 'transmission oil') {
        navigate('/oil-additives/transmission-oil');
      } else {
        navigate(`/oil-additives/${encodeURIComponent(cat)}`);
      }
    }
    setPage(1);
  };

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
      <section className="container shop-section">
        <h2 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#0e3d5b', marginBottom: '2rem', textAlign: 'center' }}>
          {selectedCategory || 'Our Selection'}
        </h2>
        <div className="shop-controls">
          <SortBy value={sortBy} onChange={setSortBy} />
          <SearchProducts value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="filters">
          <button
            type="button"
            className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryClick('')}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
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
      <AskMeBanner className="ask-me-banner" onClick={() => navigate('/contact')} />
    </div>
  );
};

export default OilAdditivesPage;
