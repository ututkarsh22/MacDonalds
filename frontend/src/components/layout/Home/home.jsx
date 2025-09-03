import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./home.css";
import mealImage from "../../../assets/ranveer.png";
import mealvid from "../../../assets/happymeal.mp4";
import HomeMenu from "../menu/HomeMenu";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Home = () => {
  // Refs for scroll sections
  const heroRef = useRef(null);
  const menuRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // Animation controls
  const heroControls = useAnimation();
  const menuControls = useAnimation();
  const aboutControls = useAnimation();
  const contactControls = useAnimation();

  // Intersection observers
  const { ref: heroInViewRef, inView: heroInView } = useInView({
    threshold: 0.3,
  });
  const { ref: menuInViewRef, inView: menuInView } = useInView({
    threshold: 0.3,
  });
  const { ref: aboutInViewRef, inView: aboutInView } = useInView({
    threshold: 0.3,
  });
  const { ref: contactInViewRef, inView: contactInView } = useInView({
    threshold: 0.3,
  });

  // Scroll to section function
  const scrollToSection = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle navigation click
  const handleNavClick = (section) => {
    switch (section) {
      case "hero":
        scrollToSection(heroRef);
        break;
      case "menu":
        scrollToSection(menuRef);
        break;
      case "about":
        scrollToSection(aboutRef);
        break;
      case "contact":
        scrollToSection(contactRef);
        break;
      default:
        break;
    }
  };

  // Trigger animations when sections come into view
  useEffect(() => {
    if (heroInView) heroControls.start("visible");
    if (menuInView) menuControls.start("visible");
    if (aboutInView) aboutControls.start("visible");
    if (contactInView) contactControls.start("visible");
  }, [
    heroInView,
    menuInView,
    aboutInView,
    contactInView,
    heroControls,
    menuControls,
    aboutControls,
    contactControls,
  ]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="home-container">
      {/* Navigation dots */}
      <div className="nav-dots">
        <button
          className={`nav-dot ${heroInView ? "active" : ""}`}
          onClick={() => handleNavClick("hero")}
          aria-label="Go to hero section"
        />
        <button
          className={`nav-dot ${menuInView ? "active" : ""}`}
          onClick={() => handleNavClick("menu")}
          aria-label="Go to menu section"
        />
        <button
          className={`nav-dot ${aboutInView ? "active" : ""}`}
          onClick={() => handleNavClick("about")}
          aria-label="Go to about section"
        />
        <button
          className={`nav-dot ${contactInView ? "active" : ""}`}
          onClick={() => handleNavClick("contact")}
          aria-label="Go to contact section"
        />
      </div>

      {/* Hero Section */}
      <section
        className="home-section home-banner"
        ref={(el) => {
          heroRef.current = el;
          heroInViewRef(el);
        }}
      >
        <motion.div
          className="home-left"
          initial="hidden"
          animate={heroControls}
          variants={fadeInUp}
        >
          <div className="text-wrapper">
            <h1>
              <span className="text-outline">The</span>
              <br />
              <span className="text-solid">Happy Meal</span>
            </h1>
            <p className="hero-subtitle">
              Delicious food that brings a smile to your face
            </p>
            <div className="hero-buttons">
              <button
                className="order-now-btn"
                onClick={() => handleNavClick("menu")}
              >
                Order Now
              </button>
              <button
                className="learn-more-btn"
                onClick={() => handleNavClick("about")}
              >
                Learn More
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="home-right"
          initial="hidden"
          animate={heroControls}
          variants={fadeInUp}
        >
          <video
            src={mealvid}
            className="promo-video"
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "70%", borderRadius: "16px" }}
          />
          <div className="availability">
            <h2>Available Now</h2>
            <p>
              <span className="icon">⏱</span> LIMITED TIME OFFER
            </p>
          </div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <section
        className="home-section menu-section"
        ref={(el) => {
          menuRef.current = el;
          menuInViewRef(el);
        }}
      >
        <motion.div
          className="section-content"
          initial="hidden"
          animate={menuControls}
          variants={fadeInUp}
        >
          <HomeMenu />
        </motion.div>
      </section>

      {/* About Section */}
      <section
        className="home-section about-section"
        ref={(el) => {
          aboutRef.current = el;
          aboutInViewRef(el);
        }}
      >
        <motion.div
          className="section-content"
          initial="hidden"
          animate={aboutControls}
          variants={fadeInUp}
        >
          <div className="about-container">
            <div className="about-text">
              <h2>About McDonald's</h2>
              <p>
                McDonald's is the world's leading food service retailer with
                more than 36,000 restaurants in more than 100 countries around
                the world.
              </p>
              <p>
                Our mission is to make delicious feel-good moments easy for
                everyone. From our famous burgers to our crispy fries, we're
                committed to serving quality food with a smile.
              </p>
              <Link to="/about" className="learn-more">
                Learn More About Us
              </Link>
            </div>
            <div className="about-image">
              <div className="image-container">
                <div className="image-box red"></div>
                <div className="image-box yellow"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section
        className="home-section contact-section"
        ref={(el) => {
          contactRef.current = el;
          contactInViewRef(el);
        }}
      >
        <motion.div
          className="section-content"
          initial="hidden"
          animate={contactControls}
          variants={fadeInUp}
        >
          <div className="contact-container">
            <h2>Find Us</h2>
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-item">
                  <h3>Address</h3>
                  <p>123 McDonald's Street</p>
                  <p>New Delhi, India 110001</p>
                </div>
                <div className="contact-item">
                  <h3>Hours</h3>
                  <p>Monday - Sunday: 10:00 AM - 11:00 PM</p>
                </div>
                <div className="contact-item">
                  <h3>Contact</h3>
                  <p>Phone: +91 123-456-7890</p>
                  <p>Email: info@mcdonaldsindia.com</p>
                </div>
              </div>
              <div className="map-placeholder">
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={13}
                  >
                    {locations.map((location, index) => (
                      <Marker
                        key={index}
                        position={{ lat: location.lat, lng: location.lng }}
                        title={location.name}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const center = {
  lat: 28.6139, // Delhi coordinates
  lng: 77.209,
};

const locations = [
  { lat: 28.6139, lng: 77.209, name: "McDonald's CP" },
  { lat: 28.6292, lng: 77.2195, name: "McDonald's Mandi House" },
  { lat: 28.6304, lng: 77.2177, name: "McDonald's ITO" },
];
