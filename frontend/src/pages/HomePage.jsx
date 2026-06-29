import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';
import heroSd from '../assests/images/hero-sd.jpg';
import Button from '../components/Button';
import backgroundImage from '../assests/images/hero-bg.jpg';
import aboutUs1 from '../assests/images/aboutUs1.jpg';
import aboutUs2 from '../assests/images/AboutUs2.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="page">
      <style>
        {`
          @media (max-width: 768px) {
            .hero-container {
              flex-direction: column !important;
              text-align: center !important;
            }
            .hero-content {
              margin-bottom: 2rem !important;
            }
            .hero-content h1 {
              font-size: 1.5rem !important;
            }
            .hero-image img {
              max-width: 100% !important;
              height: auto !important;
            }
          }
          @media (max-width: 768px) {
            [style*="gridTemplateColumns: '1fr 1fr 1fr'"] {
              grid-template-columns: 1fr !important;
            }
            [style*="gridTemplateColumns: '1fr 1fr'"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Precision Care For Every Car Fast Fixes Lasting Results...</h1>
            <Button onClick={() => navigate('/products')} style={{ marginTop: '94px', padding: '16px 40px' }}>Shop Now</Button>
          </div>
          <div className="hero-image">
            <img src={heroSd} alt="Car Care" />
          </div>
        </div>
      </section >



      {/* About Us Section */}
      < section style={{ padding: '6rem 0 3.5rem 0', background: '#f4f4f4' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#0e3d5b', marginBottom: '2rem', textAlign: 'center' }}>
            About Us
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <img src={aboutUs1} alt="Spray Bottle" style={{ width: '100%', borderRadius: '16px' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#e8721b', marginBottom: '1rem' }}>
                What We Are?
              </h3>
              <div style={{ width: '60px', height: '2px', background: '#0e3d5b', margin: '1rem auto', borderStyle: 'dotted', borderWidth: '2px' }}></div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0e3d5b', lineHeight: '1.4' }}>
                Precision Lubrication<br />for Every Mile
              </h2>
            </div>
            <div>
              <img src={aboutUs2} alt="Car Parts" style={{ width: '100%', borderRadius: '16px' }} />
            </div>
          </div>
        </div>
      </section >

      {/* Products Section */}
      < section style={{ padding: '4rem 0', background: '#fff', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#0e3d5b', margin: 'auto' }}>
              Our Products
            </h2>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#0e3d5b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            position: 'relative',
            padding: '2rem'
          }}>

            {/* Product Card 1 - Engine Oil */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={aboutUs2} alt="Engine Oil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '50px',
                  background: '#0e3d5b',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
              </div>
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0e3d5b', margin: 0 }}>
                  Engine oil of various grades
                </h3>
              </div>
            </div>

            {/* Product Card 2 - Car Shampoo */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={aboutUs1} alt="Car Shampoo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '50px',
                  background: '#0e3d5b',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0e3d5b', margin: 0 }}>
                  Car Shampoo and Cleaning items
                </h3>
              </div>
            </div>

            {/* Product Card 3 - Car Maintenance */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={heroSd} alt="Car Maintenance" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '50px',
                  background: '#0e3d5b',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
              </div>
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0e3d5b', margin: 0 }}>
                  Car Maintenance Items
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Ask Me Section */}
      < section style={{ padding: '0.5rem 0', background: '#e8721b' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Link to="/contact">
            <button className="btn" style={{ color: '#fff', background: '#e8721b', fontWeight: '700', fontSize: '1.8rem', padding: '0.1rem 0.4rem' }}>
              Ask Me
            </button>
          </Link>
        </div>
      </section >
    </div >
  );
};

export default HomePage;
