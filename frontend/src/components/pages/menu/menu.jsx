import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import CategoryFilter from '../../layout/menu/CategoryFilter';
import MenuList from '../../layout/menu/MenuList';
import './menu.css';
import Nav from '../../header/navbar/nav';

const Menu = () => {
  const [dbItems, setDbItems] = useState([]); 
  const [filteredItems, setFilteredItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/menu/`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setDbItems(data.product);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        toast.error("Could not load menu items");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    let filtered = [...dbItems];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    if (isVegOnly) {
      filtered = filtered.filter(item => item.isVegetarian === true);
    }
    
    setFilteredItems(filtered);

    console.log("Db",dbItems)
    console.log("SD",selectedCategory)
    console.log("Veg",isVegOnly)
    
  }, [selectedCategory, isVegOnly, dbItems]);

  // Dynamic Categories based on backend data
  const categories = ['All', ...new Set(dbItems.map(item => item.category))];

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  if (loading) return <div className="loader">Loading Menu...</div>;

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
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Menu;