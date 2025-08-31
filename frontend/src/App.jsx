import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Nav from "./components/header/navbar/nav.jsx";
import Home from "./components/layout/Home/home.jsx";
import Menu from "./components/pages/menu/menu.jsx";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import HappyMeal from "./components/happy-meal/HappyMeal";
import Profile from "./components/profile/Profile";
import Orders from "./components/orders/Orders";
import Checkout from "./components/checkout/Checkout";
import Payment from "./components/payment/Payment";
import OrderSuccess from "./components/order/OrderSuccess";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import mcdgif from "./assets/mcgif.gif";
import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { fetchMenu } from "./api";
import About from "./components/pages/about/about.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const [menu, setMenu] = useState([]);

  const hideNavbarRoutes = ["/login", "/signup"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenu(data))
      .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  // if (loading) {
  //   return (
  //     <div className="loading-container">
  //       <div className="fry-animation">
  //         <div className="fry-box">
  //           {[...Array(6)].map((_, i) => (
  //             <div
  //               key={i}
  //               className="fry"
  //               style={{ animationDelay: `${i * 0.2}s` }}
  //             ></div>
  //           ))}
  //         </div>
  //       </div>

       
  //       <img
  //         src={mcdgif}
  //         alt="McDonald's Fries"
  //         className="mcd-fries-gif"
  //       />

  //       <p className="loading-text">Cooking Your Meal...</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <ScrollToTop />

      <CartProvider>
        {!hideNavbar && <Nav />}

        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/happy-meal" element={<HappyMeal />} />
        <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        </Route>

        <Route path="*" element={<h1>Oops! Page Not Found</h1>} />
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;
