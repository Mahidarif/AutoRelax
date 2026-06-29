import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from '../assests/icons/logo.png';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
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
          
          /* Hide menu toggle button on larger screens - more specific */
          .header-inner .menu-toggle {
            display: none;
          }
          
          /* Show menu toggle button only on mobile */
          @media (max-width: 768px) {
            .header-inner .menu-toggle {
              display: block;
            }
          }
        `}
      </style>
      <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <img src={logo} alt="AutoRelax Logo" style={{ height: '82px' }} />
        </Link>

        {/* Menu toggle button - only visible on mobile */}
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0e3d5b" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

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
                <Link to="/oil-additives/brake-oil" className={isActive('/oil-additives/brake-oil') ? 'active' : ''}>Brake Oil</Link>
                <Link to="/oil-additives/coolants" className={isActive('/oil-additives/coolants') ? 'active' : ''}>Coolants</Link>
                <Link to="/oil-additives/transmission-oil" className={isActive('/oil-additives/transmission-oil') ? 'active' : ''}>Transmission Oil</Link>
              </div>
            )}
          </div>
          <Link to="/products" className={isActive('/products') ? 'active' : ''}>Products</Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link>
        </nav>

        <button className="search-btn" aria-label="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', marginRight: '16px' }}>
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

        <div className="header-actions">
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
      </div>
    </header>
    
    {/* Mobile Menu */}
    <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
