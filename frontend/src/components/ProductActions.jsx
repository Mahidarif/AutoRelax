import React from 'react';

const ProductActions = ({ qty, setQty, inStock, maxQty, onAddToCart, onAddToWishlist }) => {
  const stockLimit = maxQty || 10;

  return (
    <div className="actions-buttons-group">
      <div className="quantity-control-wrapper">
        <span className="quantity-label">Quantity:</span>
        <div className="quantity-picker-box">
          <button
            type="button"
            className="quantity-picker-btn"
            disabled={qty <= 1}
            onClick={() => setQty(prev => Math.max(1, prev - 1))}
          >
            −
          </button>
          <input
            type="number"
            className="quantity-picker-input"
            value={qty}
            readOnly
          />
          <button
            type="button"
            className="quantity-picker-btn"
            disabled={qty >= stockLimit}
            onClick={() => setQty(prev => Math.min(stockLimit, prev + 1))}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        className="btn-add-to-cart"
        disabled={!inStock}
        onClick={onAddToCart}
        style={{ opacity: inStock ? 1 : 0.6, cursor: inStock ? 'pointer' : 'not-allowed' }}
      >
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>

      <button
        type="button"
        className="btn-add-wishlist"
        onClick={onAddToWishlist}
      >
        Add Wish List
      </button>
    </div>
  );
};

export default ProductActions;
