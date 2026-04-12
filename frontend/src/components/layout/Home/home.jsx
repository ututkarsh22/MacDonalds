import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./home.css";
import mealImage from "../../../assets/ranveer.png";
import mealvid from "../../../assets/happymeal.mp4";
import HomeMenu from "../menu/HomeMenu";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const fadeInUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fadeInLeft = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const fadeInRight = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function useSection(threshold = 0.25) {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold });
  useEffect(() => { if (inView) controls.start("visible"); }, [inView, controls]);
  return { ref, controls, inView };
}

const Home = () => {
  const heroRef   = useRef(null);
  const menuRef   = useRef(null);
  const aboutRef  = useRef(null);
  const contactRef = useRef(null);

  const hero    = useSection(0.2);
  const menu    = useSection(0.2);
  const about   = useSection(0.25);
  const contact = useSection(0.2);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  const setRef = (sectionRef, inViewRef) => (el) => {
    sectionRef.current = el;
    inViewRef(el);
  };

  return (
    <div className="hm-page">

      {/* ── Side Nav Dots ── */}
      <div className="hm-dots">
        {[
          { ref: heroRef,    inView: hero.inView },
          { ref: menuRef,    inView: menu.inView },
          { ref: aboutRef,   inView: about.inView },
          { ref: contactRef, inView: contact.inView },
        ].map(({ ref, inView }, i) => (
          <button
            key={i}
            className={`hm-dot ${inView ? "hm-dot-active" : ""}`}
            onClick={() => scrollTo(ref)}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        className="hm-hero"
        ref={setRef(heroRef, hero.ref)}
      >
        {/* Big BG word */}
        <span className="hm-hero-bg-word" aria-hidden="true">HAPPY</span>

        <div className="hm-hero-inner">

          {/* LEFT */}
          <motion.div
            className="hm-hero-left"
            initial="hidden" animate={hero.controls} variants={fadeInLeft}
          >
            <span className="hm-pill">🔥 Limited Time Offer</span>

            <h1 className="hm-hero-title">
              <span className="hm-hero-outline">The</span>
              <br />
              <span className="hm-hero-solid">Happy</span>
              <br />
              <span className="hm-hero-solid hm-hero-yellow">Meal.</span>
            </h1>

            <p className="hm-hero-sub">
              Delicious food that brings a smile to your face —
              crafted fresh, served fast, loved by millions.
            </p>

            <div className="hm-hero-btns">
              <button className="hm-btn-red"    onClick={() => scrollTo(menuRef)}>
                Order Now <span>→</span>
              </button>
              <button className="hm-btn-ghost"  onClick={() => scrollTo(aboutRef)}>
                Our Story
              </button>
            </div>

            {/* Stats bar */}
            <div className="hm-stats">
              <div className="hm-stat">
                <p className="hm-stat-n">36K+</p>
                <p className="hm-stat-l">Restaurants</p>
              </div>
              <div className="hm-stat-sep" />
              <div className="hm-stat">
                <p className="hm-stat-n">100+</p>
                <p className="hm-stat-l">Countries</p>
              </div>
              <div className="hm-stat-sep" />
              <div className="hm-stat">
                <p className="hm-stat-n">69M</p>
                <p className="hm-stat-l">Served Daily</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="hm-hero-right"
            initial="hidden" animate={hero.controls} variants={fadeInRight}
          >
            {/* Ranveer image */}
            <div className="hm-hero-img-wrap">
              <div className="hm-hero-circle" />
              <img src={mealImage} alt="Happy Meal" className="hm-hero-img" />
            </div>

            {/* Video card */}
            <div className="hm-vid-card">
              <video
                src={mealvid}
                className="hm-vid"
                autoPlay loop muted playsInline
              />
              <div className="hm-vid-badge">
                <span className="hm-vid-dot" />
                Available Now
              </div>
            </div>

            {/* Floating tag */}
            <div className="hm-float-tag">
              <span className="hm-float-icon">⏱</span>
              <div>
                <p className="hm-float-top">LIMITED TIME</p>
                <p className="hm-float-bot">Happy Meal Deal</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="hm-scroll-hint">
          <div className="hm-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MENU
      ══════════════════════════════════════════ */}
      <section
        className="hm-section hm-menu-section"
        ref={setRef(menuRef, menu.ref)}
      >
        <motion.div
          initial="hidden" animate={menu.controls} variants={fadeInUp}
        >
          <div className="hm-section-label">— What We Serve —</div>
          <h2 className="hm-section-title">
            Our <span className="hm-accent">Menu</span>
          </h2>
          <HomeMenu />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <section
        className="hm-section hm-about-section"
        ref={setRef(aboutRef, about.ref)}
      >
        <motion.div
          className="hm-about-inner"
          initial="hidden" animate={about.controls} variants={fadeInUp}
        >
          {/* Text */}
          <div className="hm-about-text">
            <div className="hm-section-label">— Our Story —</div>
            <h2 className="hm-section-title">
              About<br /><span className="hm-accent">McDonald's</span>
            </h2>
            <p className="hm-about-p">
              McDonald's is the world's leading food service retailer with more
              than <strong>36,000 restaurants</strong> in over <strong>100 countries</strong>.
              Every single day, we serve 69 million customers across the globe.
            </p>
            <p className="hm-about-p">
              Our mission is simple — make delicious feel-good moments easy for
              everyone. From our iconic Big Mac to our crispy golden fries, every
              item is made with care and a smile.
            </p>
            <Link to="/about" className="hm-btn-red hm-inline-btn">
              Learn More About Us →
            </Link>
          </div>

          {/* Visual blocks */}
          <div className="hm-about-visual">
            <div className="hm-about-card hm-about-card-red">
              <span className="hm-about-card-num">1955</span>
              <span className="hm-about-card-label">Founded</span>
            </div>
            <div className="hm-about-card hm-about-card-yellow">
              <span className="hm-about-card-num">69M</span>
              <span className="hm-about-card-label">Daily Customers</span>
            </div>
            <div className="hm-about-img-box">
              <img src={mealImage} alt="Ranveer" className="hm-about-img" />
              <div className="hm-about-img-badge">⭐ Fan Favourite</div>
            </div>
            <div className="hm-about-card hm-about-card-dark">
              <span className="hm-about-card-num">100+</span>
              <span className="hm-about-card-label">Countries</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <section
        className="hm-section hm-contact-section"
        ref={setRef(contactRef, contact.ref)}
      >
        <motion.div
          initial="hidden" animate={contact.controls} variants={fadeInUp}
        >
          <div className="hm-section-label">— Visit Us —</div>
          <h2 className="hm-section-title">
            Find <span className="hm-accent">Us</span>
          </h2>

          <div className="hm-contact-grid">

            {/* Info Cards */}
            <div className="hm-contact-info">
              <div className="hm-info-card">
                <div className="hm-info-icon">📍</div>
                <div>
                  <h3 className="hm-info-title">Address</h3>
                  <p className="hm-info-text">123 McDonald's Street</p>
                  <p className="hm-info-text">New Delhi, India 110001</p>
                </div>
              </div>

              <div className="hm-info-card">
                <div className="hm-info-icon">🕐</div>
                <div>
                  <h3 className="hm-info-title">Hours</h3>
                  <p className="hm-info-text">Monday – Sunday</p>
                  <p className="hm-info-text">10:00 AM – 11:00 PM</p>
                </div>
              </div>

              <div className="hm-info-card">
                <div className="hm-info-icon">📞</div>
                <div>
                  <h3 className="hm-info-title">Contact</h3>
                  <p className="hm-info-text">+91 123-456-7890</p>
                  <p className="hm-info-text">info@mcdonaldsindia.com</p>
                </div>
              </div>

              <button
                className="hm-btn-red hm-contact-cta"
                onClick={() => scrollTo(menuRef)}
              >
                Order Now →
              </button>
            </div>

            {/* Map */}
            <div className="hm-map-wrap">
              <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapStyle}
                  center={mapCenter}
                  zoom={13}
                >
                  {locations.map((loc, i) => (
                    <Marker key={i} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER STRIP
      ══════════════════════════════════════════ */}
      <div className="hm-footer-strip">
        <p>© 2026 McDonald's Clone · Made with ❤️ · All rights reserved</p>
      </div>

    </div>
  );
};

export default Home;

const mapStyle   = { width: "100%", height: "100%", borderRadius: "0" };
const mapCenter  = { lat: 28.6139, lng: 77.209 };
const locations  = [
  { lat: 28.6139, lng: 77.209,  name: "McDonald's CP" },
  { lat: 28.6292, lng: 77.2195, name: "McDonald's Mandi House" },
  { lat: 28.6304, lng: 77.2177, name: "McDonald's ITO" },
];