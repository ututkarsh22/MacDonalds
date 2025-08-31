import React from 'react';
import { motion } from 'framer-motion';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory, isVegOnly, setIsVegOnly }) => {
  return (
    <div className="filter-container">
      <div className="categories">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
      
      <div className="veg-filter">
        <label className="veg-label">
          <input
            type="checkbox"
            checked={isVegOnly}
            onChange={() => setIsVegOnly(!isVegOnly)}
          />
          <span className="veg-text">Veg Only</span>
          <span className="veg-icon">🟢</span>
        </label>
      </div>
    </div>
  );
};

export default CategoryFilter;