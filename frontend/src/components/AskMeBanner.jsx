import React from 'react';

const AskMeBanner = ({ onClick, className = 'ask-me-banner-container' }) => {
  return (
    <div className={className} onClick={onClick}>
      Ask Me
    </div>
  );
};

export default AskMeBanner;
