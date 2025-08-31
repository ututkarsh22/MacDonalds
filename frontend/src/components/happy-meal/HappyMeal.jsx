import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaClock, FaTag, FaCartPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import './HappyMeal.css';

import happyMealImg1 from '../../assets/happy-meal-1.svg';
import happyMealImg2 from '../../assets/happy-meal-2.svg';
import happyMealImg3 from '../../assets/happy-meal-3.svg';
import happyMealImg4 from '../../assets/happy-meal-4.svg';

const happyMealOffers = [
  {
    id: 'hm1',
    name: 'Kids Happy Meal with Toy',
    description: 'Includes burger, small fries, drink, and a surprise toy!',
    price: 199,
    originalPrice: 249,
    image: happyMealImg1,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    badge: 'Popular',
    toys: ['Minions', 'Marvel Heroes', 'Disney Princess']
  },
  {
    id: 'hm2',
    name: 'Family Combo Meal',
    description: '2 burgers, 2 happy meals, 2 medium fries, and 4 drinks',
    price: 599,
    originalPrice: 699,
    image: happyMealImg2,
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    badge: 'Limited Time',
    toys: ['Minions', 'Marvel Heroes', 'Disney Princess']
  },
  {
    id: 'hm3',
    name: 'Birthday Party Pack',
    description: '5 happy meals, party decorations, and special birthday surprise',
    price: 999,
    originalPrice: 1299,
    image: happyMealImg3,
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    badge: 'Best Value',
    toys: ['Minions', 'Marvel Heroes', 'Disney Princess']
  },
  {
    id: 'hm4',
    name: 'Veg Happy Meal',
    description: 'Veg burger, small fries, drink, and a surprise toy!',
    price: 179,
    originalPrice: 219,
    image: happyMealImg4,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    badge: 'New',
    toys: ['Minions', 'Marvel Heroes', 'Disney Princess']
  }
];

const HappyMeal = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [selectedToy, setSelectedToy] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const updated = {};
      happyMealOffers.forEach(offer => {
        const diff = offer.endDate - now;
        updated[offer.id] = diff > 0
          ? {
              days: Math.floor(diff / (1000 * 60 * 60 * 24)),
              hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((diff / 1000 / 60) % 60),
            }
          : { days: 0, hours: 0, minutes: 0 };
      });
      setTimeLeft(updated);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleViewDetails = (offer) => {
    toast.success(`${offer.name} details viewed!`);
  };
  
  const handleAddToCart = (offer) => {
    addToCart({
      _id: offer.id,
      name: offer.name,
      price: offer.price,
      image: offer.image,
      description: offer.description
    });
  };

  const handleToySelection = (offerId, toy) => {
    setSelectedToy(prev => ({ ...prev, [offerId]: toy }));
  };

  return (
    <div className="happy-meal-page">
      <div className="happy-meal-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Happy Meal<span>®</span> Offers</h1>
          <p>Limited time offers for the whole family!</p>
        </motion.div>
      </div>

      <div className="offers-wrapper">
        <h2>Current Happy Meal Offers</h2>
        <div className="offers-grid">
          {happyMealOffers.map((offer) => (
            <motion.div
              key={offer.id}
              className="offer-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`offer-badge ${offer.badge.toLowerCase().replace(' ', '-')}`}>
                {offer.badge}
              </div>
              <div className="offer-image">
                <img src={offer.image} alt={offer.name} />
              </div>
              <div className="offer-content">
                <h3>{offer.name}</h3>
                <p>{offer.description}</p>
                <div className="offer-price">
                  <span className="current-price">₹{offer.price}</span>
                  <span className="original-price">₹{offer.originalPrice}</span>
                </div>
                <div className="offer-timer">
                  <FaClock />
                  <span>
                    {timeLeft[offer.id]?.days} days, {timeLeft[offer.id]?.hours} hrs
                  </span>
                </div>
                <div className="toy-selection">
                  <label>Select Toy:</label>
                  <div className="toy-options">
                    {offer.toys.map(toy => (
                      <button
                        key={toy}
                        className={`toy-option ${selectedToy[offer.id] === toy ? 'selected' : ''}`}
                        onClick={() => handleToySelection(offer.id, toy)}
                      >
                        {toy}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="offer-buttons">
                  <button className="view-details-btn" onClick={() => handleViewDetails(offer)}>
                    <FaInfoCircle /> View Details
                  </button>
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(offer)}>
                    <FaCartPlus /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="promo-section">
        <div className="promo-content">
          <h2>Why Kids Love Happy Meals</h2>
          <ul>
            <li>
              <FaTag />
              <div>
                <h3>Surprise Toys</h3>
                <p>Collectible toys from your favorite movies and shows</p>
              </div>
            </li>
            <li>
              <FaTag />
              <div>
                <h3>Kid-Friendly Portions</h3>
                <p>Perfect sizes for little tummies</p>
              </div>
            </li>
            <li>
              <FaTag />
              <div>
                <h3>Balanced Meals</h3>
                <p>Options include apple slices and milk</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HappyMeal;
