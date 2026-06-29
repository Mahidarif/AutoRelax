import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  // Add CSS to hide on larger screens
  const style = `
    .sidebar, .sidebar-overlay {
      display: none;
    }
    
    @media (max-width: 768px) {
      .sidebar, .sidebar-overlay {
        display: ${isOpen ? 'block' : 'none'};
      }
    }
  `;
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
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
          <Link to="/oil-additives/brake-oil" className={isActive('/oil-additives/brake-oil') ? 'active' : ''} onClick={onClose}>Brake Oil</Link>
          <Link to="/oil-additives/coolants" className={isActive('/oil-additives/coolants') ? 'active' : ''} onClick={onClose}>Coolants</Link>
          <Link to="/oil-additives/transmission-oil" className={isActive('/oil-additives/transmission-oil') ? 'active' : ''} onClick={onClose}>Transmission Oil</Link>
        </div>

        <Link to="/products" className={isActive('/products') ? 'active' : ''} onClick={onClose}>Products</Link>
        <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={onClose}>Contact Us</Link>
      </div>
    </>
  );
};

export default MobileMenu;
