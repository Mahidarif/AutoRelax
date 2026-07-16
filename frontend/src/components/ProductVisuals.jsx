import React from 'react';

const ProductVisuals = ({ image, inStock, title }) => {
  return (
    <div className="product-image-card">
      {!inStock && <span className="stock-badge">Out of Stock</span>}
      <img src={image} alt={title || 'Product Image'} />
    </div>
  );
};

export default ProductVisuals;
