import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getErrorMessage } from '../utils/helpers';

// Presentational Sub-components
import ProductVisuals from '../components/ProductVisuals';
import ProductMeta from '../components/ProductMeta';
import ProductActions from '../components/ProductActions';
import AskMeBanner from '../components/AskMeBanner';

// Styling
import '../components/ProductDetail.css';

const ProductDetailContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        
        // Align keys to destructured props required: title, price, description, image, inStock, quantity
        const mappedProduct = {
          title: data.name,
          price: data.price,
          description: data.description,
          image: data.image,
          inStock: data.countInStock > 0,
          quantity: data.countInStock,
          brand: data.brand
        };
        
        setProductData(mappedProduct);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!productData) return;
    // Map back to format expected by addToCart helper (requires name, price, etc.)
    const originalProductFormat = {
      _id: id,
      name: productData.title,
      price: productData.price,
      image: productData.image,
      countInStock: productData.quantity
    };
    addToCart(originalProductFormat, qty);
    navigate('/cart');
  };

  const handleAddToWishlist = () => {
    alert('Product added to Wishlist!');
  };

  const handleAskMe = () => {
    if (!productData) return;
    const whatsappMessage = `Hi AutoRelax, I would like to ask about the product: ${productData.title}`;
    window.open(`https://wa.me/923117229090?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!productData) return null;

  // Destructure keys to align directly with requirements
  const { title, price, description, image, inStock, quantity, brand } = productData;

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        {/* Left Column: Visuals & Description Block */}
        <div className="product-visuals-column">
          <ProductVisuals 
            image={image} 
            inStock={inStock} 
            title={title} 
          />
          {/* Description Block positioned beneath the product image */}
          <ProductMeta 
            description={description} 
            renderDescriptionOnly={true} 
          />
        </div>

        {/* Right Column: Meta info & Purchase Actions */}
        <div className="product-info-column">
          <ProductMeta 
            title={title} 
            price={price} 
            brand={brand} 
          />
          <ProductActions 
            qty={qty} 
            setQty={setQty} 
            inStock={inStock} 
            maxQty={quantity} 
            onAddToCart={handleAddToCart} 
            onAddToWishlist={handleAddToWishlist} 
          />
        </div>

      </div>
      <AskMeBanner className="ask-me-banner" onClick={handleAskMe} />
    </div>
  );
};

export default ProductDetailContainer;
