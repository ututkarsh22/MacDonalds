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
import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { fetchMenu } from "./api";
import About from "./components/pages/about/about.jsx";
import AdminDashboard from "../Admin/AdminDashboard.jsx";
import AdminLogin from "../Admin/AdminLogin.jsx";
import AdminCustomers from "../Admin/AdminCustomers.jsx";
import AdminProtected from "../Admin/AdminProtected.jsx";

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

  const hideNavbarRoutes = ["/login", "/signup", "/admin", "/admin/login","/admin/customers"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenu(data))
      .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  return (
    <>
      <ScrollToTop />
      <CartProvider>
        {!hideNavbar && <Nav />}
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
         <Route element={<AdminProtected/>}>
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
         </Route>
       
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/happy-meal" element={<HappyMeal />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<h1>Oops! Page Not Found</h1>} />
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;
