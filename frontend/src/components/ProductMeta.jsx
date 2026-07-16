import React from 'react';
import { formatPrice } from '../utils/helpers';

const ProductMeta = ({ title, price, description, brand, renderDescriptionOnly = false }) => {
  if (renderDescriptionOnly) {
    return (
      <div className="product-description-container">
        <h2 className="product-description-title">Description:</h2>
        <p className="product-description-text">{description}</p>
      </div>
    );
  }

  return (
    <div className="product-price-box">
      <span className="store-branding">{brand || 'Auto Relax'}</span>
      <h1 className="product-title-heading">{title}</h1>
      <span className="product-price-value">{formatPrice(price)}</span>
      <div className="price-divider"></div>
    </div>
  );
};

export default ProductMeta;
