// File: About.jsx
import React from 'react';
import './about.css';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div 
      className="about-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="hero">
        <h1>Golden Moments, Every Day</h1>
        <p>Where crispy fries meet warm smiles — McDonald’s isn’t just a meal, it’s a mood.</p>
      </section>

      {/* Story Section */}
      <section className="story">
        <h2>From Global to Local</h2>
        <p>
          What began as a humble burger joint in the U.S. is now a sensation across India. At McDonald’s India,
          we’ve blended international quality with regional flavors — think McAloo Tikki, Masala McEgg, and Maharaja Mac.
        </p>
        <p>
          We believe in serving food that feels personal. Our chefs draw inspiration from your taste buds — spicy, tangy, and satisfying.
        </p>
      </section>

      {/* Experience Section */}
      <section className="experience">
        <h2>The McDonald's Experience</h2>
        <ul>
          <li>🍔 Burgers crafted with care, every single time.</li>
          <li>🪑 Comfy seating for endless conversations.</li>
          <li>📱 Smooth ordering via app & self-kiosks.</li>
          <li>🎉 Perfect for family weekends or solo chill sessions.</li>
        </ul>
      </section>

      {/* Sustainability Section */}
      <section className="sustainability">
        <h2>Fresh. Fast. Responsible.</h2>
        <p>
          Our commitment goes beyond food — we support local farmers, use eco-friendly packaging,
          and constantly innovate for a greener tomorrow. Your Happy Meal helps us create a happier planet.
        </p>
      </section>

      {/* Customer Connection Section */}
      <section className="community">
        <h2>You’re Part of the Story</h2>
        <p>
          Whether it’s your first bite of a McSpicy Paneer or a late-night drive-thru order, every visit is a memory.
          And we’re here to make it special — one order, one smile at a time.
        </p>
      </section>
    </motion.div>
  );
};

export default About;
