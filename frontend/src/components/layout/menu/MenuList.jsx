import React from 'react';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';
import './MenuList.css';

const MenuList = ({ items, onAddToCart }) => {
  return (
    <motion.div 
      className="menu-items"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {items.length > 0 ? (
        items.map(item => (
          <MenuItem 
            key={item._id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))
      ) : (
        <div className="no-items-message">
          <h3>No items found</h3>
          <p>Try changing your filters or check back later for more options.</p>
        </div>
      )}
    </motion.div>
  );
};

export default MenuList;