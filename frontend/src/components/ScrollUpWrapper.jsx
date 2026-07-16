import React, { useState, useEffect } from 'react';

// This component wraps your unmodified Footer and injects the scroll button
export default function ScrollUpWrapper({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Renders your original, untouched Footer component */}
      {children}

      {/* Floating Scroll Button injected externally */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999,
            backgroundColor: '#0e3d5b', // Matches your Navigation header color
            color: 'white',
            border: 'none',
            borderRadius: '0%',
            width: '70px',
            height: '70px',
            fontSize: '35px',
            cursor: 'pointer',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &#8593;
        </button>
      )}
    </>
  );
}
