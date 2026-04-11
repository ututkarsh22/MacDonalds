import React from 'react';
import { motion } from 'framer-motion';
import './MenuItem.css';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <motion.div 
      className="menu-item"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="item-image">
        <img src={item.image.url} alt={item.name} />
        {item.isPopular && <span className="popular-badge">Popular</span>}
      </div>
      <div className="item-details">
        <h3>{item.name}</h3>
        {item.isVegetarian? <span className="veg-icon"></span> :  <span className="non-veg-icon"></span> }
        <p className="item-description">{item.description}</p>
        <div className="item-footer">
          <span className="item-price">₹{item.price}</span>
          <button 
            className="add-to-cart-btn"
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;



