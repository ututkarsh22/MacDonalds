import './nav.css';
import logo from '../../../assets/mcdlogo.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import Cart from '../../cart/Cart';

function Nav() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="mcdlogo">
          <Link to="/">
            <img src={logo} alt="McDLogo" />
          </Link>
        </div>

        <div className="navlinks">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/happy-meal">Happy Meal</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            <FaShoppingCart />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </div>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <FaUser />
                <span>{user?.name || 'User'}</span>
              </div>
              <div className="dropdown-menu">
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Nav;
