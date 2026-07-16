import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';

const MobileMenu = ({ isOpen, onClose }) => {
  const style = `
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(14, 61, 91, 0.4);
      backdrop-filter: blur(4px);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sidebar-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .sidebar {
      position: fixed;
      top: 0;
      left: -300px;
      width: 300px;
      height: 100vh;
      background: #ffffff;
      box-shadow: 4px 0 24px rgba(15, 23, 42, 0.15);
      z-index: 1001;
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }
    .sidebar.active {
      transform: translateX(300px);
    }
    .close-sidebar {
      align-self: flex-end;
      background: none;
      border: none;
      color: #0e3d5b;
      cursor: pointer;
      padding: 0.5rem;
      transition: transform 0.2s;
    }
    .close-sidebar:hover {
      transform: rotate(90deg);
      color: #e8721b;
    }
    .sidebar a {
      font-size: 1.15rem;
      font-weight: 600;
      color: #0e3d5b;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .sidebar a:hover, .sidebar a.active {
      color: #e8721b;
      background: rgba(232, 114, 27, 0.06);
      transform: translateX(4px);
    }
    .sidebar-dropdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-left: 1rem;
      border-left: 2px solid #e2e8f0;
      margin: 0.5rem 0;
    }
    .sidebar-dropdown a {
      font-size: 1rem;
      font-weight: 500;
      color: #64748b;
    }
    
    @media (min-width: 1025px) {
      .sidebar, .sidebar-overlay {
        display: none !important;
      }
    }
  `;
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products/categories').then(res => {
      setCategories(res.data.filter(Boolean));
    }).catch(console.error);
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getCategoryPath = (cat) => {
    const c = cat.toLowerCase();
    if (c === 'brake oil') return '/oil-additives/brake-oil';
    if (c === 'coolants') return '/oil-additives/coolants';
    if (c === 'transmission oil') return '/oil-additives/transmission-oil';
    if (c === 'oil additives') return '/oil-additives';
    return `/oil-additives/${encodeURIComponent(cat)}`;
  };

  return (
    <>
      <style>{style}</style>
      {/* Sidebar overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <button className="close-sidebar" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Link to="/" className={isActive('/') ? 'active' : ''} onClick={onClose}>Home</Link>

        <div className="sidebar-dropdown">
          <Link to="/oil-additives" className={isActive('/oil-additives') ? 'active' : ''} onClick={onClose}>Oil & Additives</Link>
          {categories.map(cat => (
            <Link 
              key={cat} 
              to={getCategoryPath(cat)} 
              className={isActive(getCategoryPath(cat)) ? 'active' : ''} 
              onClick={onClose}
            >
              {cat}
            </Link>
          ))}
        </div>

        <Link to="/products" className={isActive('/products') ? 'active' : ''} onClick={onClose}>Products</Link>
        <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={onClose}>Contact Us</Link>
      </div>
    </>
  );
};

export default MobileMenu;


