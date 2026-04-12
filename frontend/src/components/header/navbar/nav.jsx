import './nav.css';
import logo from '../../../assets/mcdlogo.svg';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import Cart from '../../cart/Cart';

function Nav() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">

          {/* ── Logo ── */}
          <Link to="/" className="nav-logo">
            <img src={logo} alt="McDonald's" />
          </Link>

          {/* ── Desktop Links ── */}
          <ul className="nav-links">
            <li><Link to="/"           className={`nav-link ${isActive('/')           ? 'nav-link-active' : ''}`}>Home</Link></li>
            <li><Link to="/happy-meal" className={`nav-link ${isActive('/happy-meal') ? 'nav-link-active' : ''}`}>Happy Meal</Link></li>
            <li><Link to="/menu"       className={`nav-link ${isActive('/menu')       ? 'nav-link-active' : ''}`}>Menu</Link></li>
            <li><Link to="/about"      className={`nav-link ${isActive('/about')      ? 'nav-link-active' : ''}`}>About</Link></li>
          </ul>

          {/* ── Right Side ── */}
          <div className="nav-right">

            {/* Cart */}
            <button className="nav-cart" onClick={() => setIsCartOpen(true)}>
              <FaShoppingCart />
              {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div
                className="nav-user"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="nav-user-btn">
                  <div className="nav-avatar">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </div>
                  <span className="nav-user-name">{user?.name || 'User'}</span>
                  <span className="nav-chevron">▾</span>
                </button>

                {isDropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <p className="nav-dropdown-name">{user?.name || 'User'}</p>
                      <p className="nav-dropdown-email">{user?.email || ''}</p>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link to="/profile" className="nav-dropdown-item">
                      <span>👤</span> My Profile
                    </Link>
                    <Link to="/orders" className="nav-dropdown-item">
                      <span>🧾</span> My Orders
                    </Link>
                    <div className="nav-dropdown-divider" />
                    <button className="nav-dropdown-logout" onClick={logout}>
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth">
                <Link to="/login"  className="nav-login">Login</Link>
                <Link to="/signup" className="nav-signup">Sign Up</Link>
              </div>
            )}

            {/* Hamburger */}
            <button className="nav-hamburger" onClick={() => setIsMobileOpen(!isMobileOpen)}>
              {isMobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMobileOpen && (
          <div className="nav-mobile">
            <ul className="nav-mobile-links">
              {[
                { to: '/',           label: 'Home' },
                { to: '/happy-meal', label: 'Happy Meal' },
                { to: '/menu',       label: 'Menu' },
                { to: '/orders',     label: 'My Orders' },
                { to: '/about',      label: 'About' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`nav-mobile-link ${isActive(to) ? 'nav-mobile-link-active' : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav-mobile-bottom">
              {isAuthenticated ? (
                <>
                  <div className="nav-mobile-user">
                    <div className="nav-avatar">{(user?.name || 'U')[0].toUpperCase()}</div>
                    <div>
                      <p className="nav-mobile-uname">{user?.name}</p>
                      <p className="nav-mobile-uemail">{user?.email}</p>
                    </div>
                  </div>
                  <button className="nav-mobile-logout" onClick={() => { logout(); setIsMobileOpen(false); }}>
                    Logout
                  </button>
                </>
              ) : (
                <div className="nav-mobile-auth">
                  <Link to="/login"  className="nav-login"  onClick={() => setIsMobileOpen(false)}>Login</Link>
                  <Link to="/signup" className="nav-signup" onClick={() => setIsMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Nav;