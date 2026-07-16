import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '../utils/api';

import ProductCard from '../components/ProductCard';

import SortBy from '../components/SortBy';

import SearchProducts from '../components/SearchProducts';

import Loader from '../components/Loader';

import Message from '../components/Message';

import { getErrorMessage } from '../utils/helpers';
import AskMeBanner from '../components/AskMeBanner';



const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');

  const [category, setCategory] = useState('');

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  const [sortBy, setSortBy] = useState('recent');

  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchQuery(search);
  }, [location.search]);



  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const { data } = await api.get('/products/categories');

        setCategories(data);

      } catch {

        /* categories are optional */

      }

    };

    fetchCategories();

  }, []);



  useEffect(() => {

    const fetchProducts = async () => {

      setLoading(true);

      try {

        const params = new URLSearchParams({ page });

        if (keyword) params.append('keyword', keyword);

        if (category) params.append('category', category);



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

  }, [keyword, category, page]);



  // Mock products for frontend display - includes all products from other pages

  const mockProducts = [

    // Brake Oil products

    { _id: '1', name: 'Brakes Oils of Royal Purple', price: 2500, category: 'Brake Oil' },

    { _id: '2', name: 'Break-N40 WT', price: 3200, category: 'Brake Oil' },

    { _id: '3', name: 'DOT 4 Brake Fluid', price: 1800, category: 'Brake Oil' },

    { _id: '4', name: 'Synthetic Brake Oil', price: 4500, category: 'Brake Oil' },

    { _id: '5', name: 'Premium Brake Fluid', price: 2100, category: 'Brake Oil' },

    { _id: '6', name: 'Heavy Duty Brake Oil', price: 3800, category: 'Brake Oil' },

    // Coolants products

    { _id: '7', name: 'Premium Coolant Blue', price: 1500, category: 'Coolants' },

    { _id: '8', name: 'Long Life Coolant', price: 2200, category: 'Coolants' },

    { _id: '9', name: 'Anti-Freeze Coolant', price: 1800, category: 'Coolants' },

    { _id: '10', name: 'Organic Acid Technology Coolant', price: 2800, category: 'Coolants' },

    { _id: '11', name: 'Heavy Duty Coolant', price: 3200, category: 'Coolants' },

    { _id: '12', name: 'Universal Coolant', price: 1900, category: 'Coolants' },

    // Transmission Oil products

    { _id: '13', name: 'ATF Type F Transmission Fluid', price: 3500, category: 'Transmission Oil' },

    { _id: '14', name: 'Synthetic Transmission Oil', price: 4800, category: 'Transmission Oil' },

    { _id: '15', name: 'CVT Transmission Fluid', price: 4200, category: 'Transmission Oil' },

    { _id: '16', name: 'Dual Clutch Transmission Oil', price: 5500, category: 'Transmission Oil' },

    { _id: '17', name: 'Manual Transmission Oil', price: 2900, category: 'Transmission Oil' },

    { _id: '18', name: 'Automatic Transmission Fluid', price: 3800, category: 'Transmission Oil' },

    // Oil & Additives products

    { _id: '19', name: 'Premium Engine Oil 5W-30', price: 4500, category: 'Oil & Additives' },

    { _id: '20', name: 'Synthetic Motor Oil', price: 5200, category: 'Oil & Additives' },

    { _id: '21', name: 'Diesel Engine Oil', price: 3800, category: 'Oil & Additives' },

    { _id: '22', name: 'Power Steering Fluid', price: 2200, category: 'Oil & Additives' },

    { _id: '23', name: 'Brake Fluid DOT 3', price: 1800, category: 'Oil & Additives' },

    { _id: '24', name: 'Engine Oil Additive', price: 1500, category: 'Oil & Additives' },

    { _id: '25', name: 'Fuel System Cleaner', price: 1200, category: 'Oil & Additives' },

    { _id: '26', name: 'Oil Treatment', price: 950, category: 'Oil & Additives' },

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

          Our Complete Collection

        </h2>

        

        <div className="shop-controls">

          <SortBy value={sortBy} onChange={setSortBy} />

          <SearchProducts value={searchQuery} onChange={setSearchQuery} />

        </div>



        <div className="filters">

          <button

            type="button"

            className={`filter-btn ${!category ? 'active' : ''}`}

            onClick={() => {

              setCategory('');

              setPage(1);

            }}

          >

            All

          </button>

          {categories.map((cat) => (

            <button

              key={cat}

              type="button"

              className={`filter-btn ${category === cat ? 'active' : ''}`}

              onClick={() => {

                setCategory(cat);

                setPage(1);

              }}

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

          <Message variant="info">No products found.</Message>

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



export default ProductsPage;

