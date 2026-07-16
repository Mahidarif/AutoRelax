import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';
import heroSd from '../assests/images/hero-sd.png';
import heroSd1 from '../assests/images/hero-sd2.png';
import backgroundImage from '../assests/images/hero-bg.jpg';
import aboutUs1 from '../assests/images/aboutUs1.jpg';
import aboutUs2 from '../assests/images/AboutUs2.jpg';
import AskMeBanner from '../components/AskMeBanner';

const heroSlides = [
  {
    heading: 'Precision Care For Every Car Fast Fixes Lasting Results...',
    image: heroSd,
    alt: 'Car Care',
  },
  {
    heading: 'Premium Quality Oils & Lubricants For Peak Performance...',
    image: heroSd1,
    alt: 'Premium Oils',
  },
];

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

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Reset timer on manual navigation
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
  }, []);

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
          /* ---- Hero Slideshow: Break out of main padding ---- */
          .hero-slideshow {
            position: relative;
            overflow: hidden;
            min-height: 720px;
            height: 720px;
            background-color: #dce2e6;
            background-image: url('${backgroundImage}');
            background-size: cover;
            background-position: top;
            background-repeat: center;
            /* Break out of .main padding to be flush with header */
            margin: -10.3rem -2rem 0 -1rem;
          }

          .hero-slides-track {
            display: flex;
            transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
            height: 100%;
            min-height: 520px;
          }

          .hero-slide {
            min-width: 100%;
            display: flex;
            align-items: stretch;
            height: 520px;
          }

          .hero-slide .hero-container {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            gap: 0;
            width: min(1200px, 92%);
            margin: 0 auto;
            height: 100%;
            padding: 0;
            position: relative;
          }

          /* ---- Left: Text + Button ---- */
          .hero-slide .hero-content {
            flex: 0 0 45%;
            max-width: 70%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            padding-left: 0; /* Align perfectly with logo container edge */
            padding-top: 19rem;
            padding-bottom: 4.5rem; /* Space from bottom for button */
          }

          .hero-slide .hero-content h1 {
            font-size: clamp(2rem, 3.4vw, 2.75rem);
            color: #0e3d5b;
            font-weight: 900;
            font-family: 'DM Sans', system-ui, sans-serif;
            line-height: 1.25;
            text-align: left;
            max-width: 480px;
            opacity: 0;
            transform: translateY(24px);
            animation: heroSlideUpFadeIn 0.65s ease forwards;
            animation-delay: 0.15s;
          }

          /* Shop Now — anchored to bottom-left */
          .hero-shop-btn {
            display: inline-block;
            background: #e8721b;
            color: #fff;
            
            font-size: 1.1rem;
            font-weight: 700;
            font-family: 'DM Sans', system-ui, sans-serif;
            padding: 0.9rem 2.8rem;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
            opacity: 0;
            transform: translateY(16px);
            animation: heroSlideUpFadeIn 0.65s ease forwards;
            animation-delay: 0.3s;
            margin-top: 07rem; /* Push button to the bottom */
          }

          .hero-shop-btn:hover {
            background: #2d2886ff;
            transform: translateY(-2px);
          }

          /* ---- Right: Product Image ---- */
          .hero-slide .hero-image {
            flex: 0 0 88%;
            max-width: 58%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: 100%;
            padding-top: 5rem;
            overflow: visible;
          }

          .hero-slide .hero-image.slide-0 img {
            max-width: 130%;
            width: 130%;
            height: 120%;
            transform: translateX(-4rem) scale(1.1);
            animation: heroZoomFadeIn0 0.75s ease forwards;
          }

          .hero-slide .hero-image.slide-1 img {
            max-width: 110%;
            width: 110%;
            height: 110%;
            transform: scale(0.95);
            animation: heroZoomFadeIn1 0.75s ease forwards;
          }

          .hero-slide .hero-image img {
            object-fit: contain;
            object-position: center bottom;
            opacity: 0;
            animation-delay: 0.2s;
          }

          @keyframes heroSlideUpFadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes heroZoomFadeIn0 {
            to {
              opacity: 1;
              transform: translateX(-4rem) scale(1.35);
            }
          }

          @keyframes heroZoomFadeIn1 {
            to {
              opacity: 1;
              transform: scale(1.0);
            }
          }

          /* Dot Indicators */
          .hero-dots {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
          }

          .hero-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background: #aab4be;
            cursor: pointer;
            transition: background 0.3s ease;
            padding: 0;
          }

          .hero-dot.active {
            background: #2c4e61;
          }

          .hero-dot:hover:not(.active) {
            background: #7a9aaa;
          }

          /* Responsive — Tablet */
          @media (max-width: 1024px) {
            .hero-slideshow {
              margin: -1.8rem -1.5rem 0 -1.5rem;
            }
            .hero-slide .hero-container {
              width: 96%;
              padding: 0 1rem;
            }
          }

          /* Responsive — Mobile */
          @media (max-width: 768px) {
            .hero-slideshow {
              min-height: auto;
              height: auto;
              margin: -1.3rem -1rem 0 -1rem;
            }
            .hero-slides-track {
              min-height: auto;
            }
            .hero-slide {
              height: auto;
              padding: 2.5rem 0;
            }
            .hero-slide .hero-container {
              flex-direction: column-reverse;
              padding: 0 1.25rem;
              gap: 1.5rem;
              width: 100%;
            }
            .hero-slide .hero-content {
              flex: unset;
              max-width: 100%;
              text-align: center;
              padding: 0 0.5rem 1.5rem;
              height: auto;
              align-items: center;
            }
            .hero-slide .hero-content h1 {
              font-size: 1.75rem;
              text-align: center;
            }
            .hero-shop-btn {
              margin: 1.5rem auto 0;
              padding: 0.8rem 2.2rem;
            }
            .hero-slide .hero-image {
              flex: unset;
              max-width: 100%;
              width: 100%;
              height: 260px;
              justify-content: center;
              overflow: hidden;
            }
            .hero-slide .hero-image img {
              max-width: 100%;
              width: 100%;
              height: 100%;
            }
            .hero-dots {
              bottom: 10px;
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

      {/* Hero Slideshow Section */}
      <section className="hero-slideshow">
        <div
          className="hero-slides-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div className="hero-slide" key={index}>
              <div className="hero-container">
                <div className="hero-content">
                  {index === currentSlide && (
                    <>
                      <h1 key={`h-${currentSlide}`}>{slide.heading}</h1>
                      <button
                        className="hero-shop-btn"
                        onClick={() => navigate('/products')}
                      >
                        Shop Now
                      </button>
                    </>
                  )}
                </div>
                <div className={`hero-image slide-${index}`}>
                  <img src={slide.image} alt={slide.alt} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => { goToSlide(index); resetTimer(); }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>



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
            <div 
              onClick={() => navigate('/products')}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#0e3d5b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
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
      <AskMeBanner className="ask-me-banner" onClick={() => navigate('/contact')} />
    </div >
  );
};

export default HomePage;
