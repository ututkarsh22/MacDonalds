import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './HomeMenu.css';

// Assuming images are imported as before
import burger1 from '../../../assets/veg.png';
import burger2 from '../../../assets/mcaloo-tikki.png';
import burger3 from '../../../assets/mcchicken.png';
import burger4 from '../../../assets/mcveggie.png';
import burger5 from '../../../assets/butter-chicken.png';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';


const HomeMenu = () => {
  const [bestSeller , setBestSeller] = useState([]);
  const navigate = useNavigate();
  const {user} = useAuth();
  const {addToCart} = useCart();
  let cred;
  useEffect(() => {
    const bestMenu = async() => {
      try {

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/menu/`,{
          method : "GET",
          credentials : "include",
        })

        const data = await res.json();
        console.log("data from menuBest",data);
        const limit = data.product.slice(0,5);
        setBestSeller(limit);
        
      } catch (error) {
        setBestSeller([]);
        console.log("error",error);
      }
    }

    bestMenu();
  },[])
  const handleAction = (item) => {
    if(!user)
    {
      return navigate('/login');
    }
    
    addToCart(item);
  };

  return (
    <section className="best-products-section">
      <div className="section-header">
        <h2 className="section-title">Our Best Sellers</h2>
        <p>Handpicked favorites just for you</p>
      </div>

     <div className="horizontal-scroller">
  {bestSeller.map((item) => (
    <motion.div 
      className="product-card" 
      key={item._id} // Changed from item.id to item._id
      whileHover={{ y: -10 }}
    >
      {/* Badge logic: Shows 'Veg' if isVegetarian is true, else 'Popular' */}
      <div className="card-badge">
        {item.isVegetarian ? "Veg" : "Non-Veg"}
      </div>

      <div className="image-container">
        {/* Accessing item.image.url based on your Cloudinary structure */}
        <img src={item.image.url} alt={item.name} />
      </div>

      <div className="product-info">
        <h3>{item.name}</h3>
        {/* Added a short description if you want it catchy */}
        <p className="product-desc">{item.description.substring(0, 40)}...</p>
        <p className="product-price">₹{item.price}</p>
        
        <button 
          className="order-btn" 
          onClick={() => handleAction(item)}
        >
          Order Now
        </button>
      </div>
    </motion.div>
  ))}
</div>
      
      <div className="scroll-hint">Scroll to explore →</div>
    </section>
  );
};

export default HomeMenu;