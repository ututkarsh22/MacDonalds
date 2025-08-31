import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import CategoryFilter from '../../layout/menu/CategoryFilter';
import MenuList from '../../layout/menu/MenuList';

import burger1 from '../../../assets/burger1.jpg';
import burger2 from '../../../assets/burger2.jpg';
import burger3 from '../../../assets/burger3.jpg';
import burger4 from '../../../assets/burger4.jpg';
import burger5 from '../../../assets/burger5.jpg';
import burger6 from '../../../assets/burger6.jpg';
import burger7 from '../../../assets/burger7.jpg';

import fries from '../../../assets/fries.jpg';
import nugget from '../../../assets/nuggets.jpg';
import chilliBurger from '../../../assets/chilliburger.jpg';
import brownie from '../../../assets/brownie.jpg';

import sprite from '../../../assets/sprite.jpg';
import cola from '../../../assets/cola.jpg';

import fries2 from '../../../assets/fries2.jpg';
import hotFudge from '../../../assets/hotfudge.jpg';
import iceCream from '../../../assets/icecream.jpg';
import coffee from '../../../assets/coffee.jpg';

import './menu.css';


const menuItems = [
  {
    _id: 'b1',
    name: 'Veg Surprise Burger',
    description: 'A scrumptious potato patty topped with a delectable Italian herb sauce.',
    price: 129,
    category: 'Burgers',
    image: burger2,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'b2',
    name: 'McAloo Tikki Burger',
    description: 'Delicious aloo tikki patty with tangy sauces and crisp veggies in a toasted bun.',
    price: 149,
    category: 'Burgers',
    image: burger3,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'b3',
    name: 'McChicken Burger',
    description: 'Tender and juicy chicken patty with creamy mayo and shredded lettuce.',
    price: 199,
    category: 'Burgers',
    image: burger6,
    isVegetarian: false,
    isPopular: true
  },
  {
    _id: 'b4',
    name: 'McVeggie Burger',
    description: 'A wholesome patty of potatoes, peas, carrots and beans, spiced and crumb-coated.',
    price: 179,
    category: 'Burgers',
    image: burger7,
    isVegetarian: true,
    isPopular: false
  },
  {
    _id: 'b5',
    name: 'Butter Chicken Grilled Burger',
    description: 'Spicy grilled chicken patty topped with creamy butter chicken sauce.',
    price: 229,
    category: 'Burgers',
    image: chilliBurger,
    isVegetarian: false,
    isPopular: true
  },

  {
    _id: 's1',
    name: 'French Fries',
    description: 'Golden, crispy, and perfectly salted French fries.',
    price: 99,
    category: 'Sides',
    image: fries,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 's2',
    name: 'Chicken McNuggets',
    description: 'Tender, juicy chicken nuggets with a crispy coating.',
    price: 159,
    category: 'Sides',
    image: nugget,
    isVegetarian: false,
    isPopular: true
  },
  {
    _id: 's3',
    name: 'Piri Piri Spice Mix',
    description: 'Spice up your fries with this zesty piri piri mix.',
    price: 25,
    category: 'Sides',
    image: fries2,
    isVegetarian: true,
    isPopular: false
  },

  {
    _id: 'd1',
    name: 'Coca-Cola',
    description: 'Refreshing Coca-Cola to complement your meal.',
    price: 89,
    category: 'Beverages',
    image: cola,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'd2',
    name: 'Sprite',
    description: 'Crisp, refreshing lemon-lime flavored Sprite.',
    price: 89,
    category: 'Beverages',
    image: sprite,
    isVegetarian: true,
    isPopular: false
  },
  {
    _id: 'd3',
    name: 'McCafé Iced Coffee',
    description: 'Smooth, cold coffee with a perfect blend of cream and sweetness.',
    price: 159,
    category: 'Beverages',
    image: coffee,
    isVegetarian: true,
    isPopular: true
  },

  {
    _id: 'ds1',
    name: 'McFlurry with Oreo',
    description: 'Creamy vanilla soft serve with crunchy Oreo cookie pieces.',
    price: 129,
    category: 'Desserts',
    image: iceCream,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'ds2',
    name: 'Soft Serve Hot Fudge Sundae',
    description: 'Creamy vanilla soft serve topped with hot fudge sauce.',
    price: 99,
    category: 'Desserts',
    image: hotFudge,
    isVegetarian: true,
    isPopular: true
  },
  {
    _id: 'ds3',
    name: 'Brownie Hot Fudge',
    description: 'Warm chocolate brownie topped with vanilla soft serve and hot fudge sauce.',
    price: 159,
    category: 'Desserts',
    image: brownie,
    isVegetarian: true,
    isPopular: false
  }
];


const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const { addToCart } = useCart();
  

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  useEffect(() => {
    let filtered = [...menuItems];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (isVegOnly) {
      filtered = filtered.filter(item => item.isVegetarian);
    }
    
    setFilteredItems(filtered);
  }, [selectedCategory, isVegOnly]);
  
  const handleItemClick = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover the delicious world of McDonald's</p>
      </div>
      
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isVegOnly={isVegOnly}
        setIsVegOnly={setIsVegOnly}
      />
      
      <MenuList 
        items={filteredItems}
        onAddToCart={handleItemClick}
      />
    </div>
  );
};

export default Menu;