import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from '../assests/icons/logo.png';
import MobileMenu from './MobileMenu';
import api from '../utils/api';


const Header = () => {
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    api.get('/products/categories').then(res => {
      setCategories(res.data.filter(Boolean));
    }).catch(console.error);
  }, []);

  const getCategoryPath = (cat) => {
    const c = cat.toLowerCase();
    if (c === 'brake oil') return '/oil-additives/brake-oil';
    if (c === 'coolants') return '/oil-additives/coolants';
    if (c === 'transmission oil') return '/oil-additives/transmission-oil';
    if (c === 'oil additives') return '/oil-additives';
    return `/oil-additives/${encodeURIComponent(cat)}`;
  };


  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setSearchOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setSearchOpen(false);
    }, 300);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isProductsPage = 
    location.pathname.startsWith('/products') || 
    location.pathname.startsWith('/oil-additives');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <style>
        {`
          .nav-dropdown {
            position: relative;
            display: inline-block;
          }
          .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: #fff;
            min-width: 180px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 8px;
            padding: 0.5rem 0;
            z-index: 1000;
          }
          .dropdown-menu a {
            display: block;
            padding: 0.75rem 1rem;
            color: #0e3d5b;
            text-decoration: none;
            font-size: 0.95rem;
            transition: background 0.2s ease;
          }
          .dropdown-menu a:hover,
          .dropdown-menu a.active {
            background: #f0f8ff;
            color: #e8721b;
          }
          .nav a.active {
            color: #e8721b;
            border-bottom: 2px solid #e8721b;
          }
          
          /* Header Search Container */
          .header-search-container {
            position: relative;
            display: flex;
            align-items: center;
            margin-left: auto;
            margin-right: 16px;
          }

          .search-popup {
            position: absolute;
            top: 100%;
            right: 0;
            background: #fff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            z-index: 2000;
            min-width: 250px;
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          .search-popup::before {
            content: '';
            position: absolute;
            top: -12px;
            left: 0;
            right: 0;
            height: 12px;
          }

          .search-popup input {
            flex: 1;
            padding: 0.5rem 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 0.875rem;
            outline: none;
            font-family: 'DM Sans', sans-serif;
            color: #0e3d5b;
          }

          .search-popup input:focus {
            border-color: #e8721b;
          }

          .search-popup-btn {
            background: #0e3d5b;
            color: #fff;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s ease;
          }

          .search-popup-btn:hover {
            background: #e8721b;
          }
          
          /* Hide menu toggle button on larger screens */
          .header-inner .menu-toggle {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            align-items: center;
            justify-content: center;
            margin-left: 1rem;
            transition: transform 0.2s ease;
          }
          
          .header-inner .menu-toggle:hover {
            transform: scale(1.1);
          }
          
          /* Show menu toggle button only on mobile/tablet */
          @media (max-width: 1024px) {
            .header-inner .menu-toggle {
              display: flex;
            }
            .header-inner .nav {
              display: none !important;
            }
          }
        `}
      </style>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <img src={logo} alt="AutoRelax Logo" style={{ height: '82px' }} />
          </Link>

          <nav className="nav">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <div 
              className="nav-dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link to="/oil-additives" className={isActive('/oil-additives') ? 'active' : ''} style={{ position: 'relative' }}>
                Oil & Additives
              </Link>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {categories.map(cat => (
                    <Link 
                      key={cat} 
                      to={getCategoryPath(cat)} 
                      className={location.pathname === getCategoryPath(cat) ? 'active' : ''}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/products" className={isActive('/products') ? 'active' : ''}>Products</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link>
          </nav>

          {/* Search Popup - Only visible on non-products pages */}
          {!isProductsPage && (
            <div 
              className="header-search-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="search-btn" 
                onClick={() => setSearchOpen(!searchOpen)} 
                aria-label="Search" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#0e3d5b"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              {searchOpen && (
                <form className="search-popup" onSubmit={handleSearchSubmit}>
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="search-popup-btn">Go</button>
                </form>
              )}
            </div>
          )}

          <div className="header-actions" style={{ marginLeft: isProductsPage ? 'auto' : '0' }}>
            <Link to="/cart" className="cart-link" aria-label="Cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#0e3d5b"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>

          {/* Menu toggle button - visible on mobile/tablet */}
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0e3d5b" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
