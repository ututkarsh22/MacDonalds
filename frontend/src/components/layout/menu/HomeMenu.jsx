import React, { useState, useEffect } from 'react';
import './HomeMenu.css';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import burger1 from '../../../assets/veg.png';
import burger2 from '../../../assets/mcaloo-tikki.png';
import burger3 from '../../../assets/mcchicken.png';
import burger4 from '../../../assets/mcveggie.png';
import burger5 from '../../../assets/butter-chicken.png';
import mcArch from '../../../assets/mcdlogo.svg';

const meals = [
  {
    _id: 'b1',
    name: 'Veg Surprise Burger',
    description: 'A scrumptious potato patty topped with a delectable Italian herb sauce and shredded onions placed between perfectly toasted buns.',
    price: 129,
    size: '132g',
    allergens: 'Cereal containing gluten, Milk, Soya',
    image: burger1,
    ingredients: 'Regular Bun, Italian mayo, Shredded onion, Herb Chilli Potato patty',
    nutrition: {
      Energy: '313.44kCal', Protein: '5.71g', 'Total Fat': '14.95g', 'Sat Fat': '3.73g', 'Trans Fat': '0.14g',
      Cholesterols: '0.0mg', 'Total Carbs': '39.84g', 'Total Sugars': '5.66g', 'Added Sugars': '1.64g',
      Sodium: '504.19mg'
    }
  },
  {
    _id: 'b2',
    name: 'McAloo Tikki Burger',
    description: 'Delicious aloo tikki patty with tangy sauces and crisp veggies in a toasted bun.',
    price: 149,
    size: '150g',
    allergens: 'Gluten, Soya',
    image: burger2,
    ingredients: 'Aloo patty, Bun, Mayonnaise, Lettuce, Onions',
    nutrition: {
      Energy: '300kCal', Protein: '6g', 'Total Fat': '12g', 'Sat Fat': '3g', 'Trans Fat': '0.1g',
      Cholesterols: '0mg', 'Total Carbs': '40g', 'Total Sugars': '5g', 'Added Sugars': '1g',
      Sodium: '450mg'
    }
  },
  {
    _id: 'b3',
    name: 'McChicken Burger',
    description: 'Tender and juicy chicken patty with creamy mayo and shredded lettuce.',
    price: 199,
    size: '170g',
    allergens: 'Egg, Milk, Gluten',
    image: burger3,
    ingredients: 'Chicken patty, Bun, Mayonnaise, Lettuce',
    nutrition: {
      Energy: '430kCal', Protein: '14g', 'Total Fat': '22g', 'Sat Fat': '4.5g', 'Trans Fat': '0.2g',
      Cholesterols: '25mg', 'Total Carbs': '38g', 'Total Sugars': '6g', 'Added Sugars': '2g',
      Sodium: '600mg'
    }
  },
  {
    _id: 'b4',
    name: 'McVeggie Burger',
    description: 'A wholesome patty of potatoes, peas, carrots and beans, spiced and crumb-coated.',
    price: 179,
    size: '160g',
    allergens: 'Gluten, Soya',
    image: burger4,
    ingredients: 'Vegetable patty, Bun, Mayonnaise, Lettuce',
    nutrition: {
      Energy: '350kCal', Protein: '8g', 'Total Fat': '15g', 'Sat Fat': '3.5g', 'Trans Fat': '0.1g',
      Cholesterols: '0mg', 'Total Carbs': '42g', 'Total Sugars': '4g', 'Added Sugars': '1.5g',
      Sodium: '550mg'
    }
  },
  {
    _id: 'b5',
    name: 'Butter Chicken Grilled Burger',
    description: 'Spicy grilled chicken patty topped with creamy butter chicken sauce.',
    price: 229,
    size: '180g',
    allergens: 'Milk, Gluten',
    image: burger5,
    ingredients: 'Chicken patty, Bun, Butter chicken sauce, Onions',
    nutrition: {
      Energy: '460kCal', Protein: '16g', 'Total Fat': '25g', 'Sat Fat': '5g', 'Trans Fat': '0.15g',
      Cholesterols: '30mg', 'Total Carbs': '36g', 'Total Sugars': '6.5g', 'Added Sugars': '2g',
      Sodium: '620mg'
    }
  }
];

const HomeMenu = () => {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('');
  const meal = meals[index];
  const { addToCart } = useCart();

  const nextMeal = () => setIndex((index + 1) % meals.length);
  const prevMeal = () => setIndex((index - 1 + meals.length) % meals.length);

  const handleViewDetails = () => {
    toast.success(`${meal.name} details viewed!`);
    setMessage(`${meal.name} details viewed! ✅`);
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleAddToCart = () => {
    addToCart({
      _id: meal._id,
      name: meal.name,
      price: meal.price,
      image: meal.image,
      description: meal.description
    });
  };

  useEffect(() => {
    const interval = setInterval(nextMeal, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="menu-container">
      <img src={mcArch} className="mc-arch" alt="mc-arch" />
      
      <div className="menu-header">
        <span className="active">BURGERS & WRAPS</span>
        <span>SNACKS & SIDES</span>
        <span>DESSERTS</span>
        <span>BEVERAGES</span>
      </div>

      <div className="menu-content">
        <motion.div
          key={meal.name}
          className="menu-left"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="meal-title">{meal.name}</h2>
          <p className="meal-sub">A surprise that will leave you wide-eyed.</p>
          <p className="meal-desc">{meal.description}</p>
          <p><strong>Serving Size:</strong> {meal.size}</p>
          <p className="allergens"><strong>Allergen Warning! Contains:</strong><br />{meal.allergens}</p>

          <div className="nutrition-box">
            {Object.entries(meal.nutrition).map(([key, val]) => (
              <div className="nutri-item" key={key}>
                <p className="nutri-val">{val}</p>
                <p className="nutri-key">{key}</p>
              </div>
            ))}
          </div>

          <div className="meal-tabs">
            {meals.map((m, i) => (
              <button
                key={m.name}
                className={`meal-tab ${i === index ? 'active-tab' : ''}`}
                onClick={() => setIndex(i)}>
                <img src={m.image} alt={m.name} />
                <span>{m.name}</span>
              </button>
            ))}
          </div>

          <div className="home-menu-buttons">
            <button className="view-details" onClick={handleViewDetails}>View Details 🔍</button>
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart 🛒</button>
          </div>
          {message && <p className="details-message">{message}</p>}
        </motion.div>

        <motion.div
          key={meal.name + '-img'}
          className="menu-right"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img src={meal.image} alt={meal.name} className="meal-main-img" />
          <div className="ingredients-box">
            <h4>Ingredients</h4>
            <p>{meal.ingredients}</p>
          </div>
        </motion.div>
      </div>

      <div className="menu-nav-buttons">
        <button className="nav-btn" onClick={prevMeal}>{'<'}</button>
        <button className="nav-btn black" onClick={nextMeal}>{'>'}</button>
      </div>
    </div>
  );
};

export default HomeMenu;
