import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';
import useCart from '@/App/hooks/useCart';
import './Navbar.css';

const Navbar: React.FC = memo(() => {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src="/logo.png" alt="Manticore Logo" />
          </Link>
        </div>

        <div className="nav-center">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search listings..." />
          </div>
        </div>

        <div className="nav-right">
          <button 
            className="nav-cart-button"
            onClick={() => navigate('/trade/cart')}
          >
            <FiShoppingCart />
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </button>
          <Link to="/trade" className="nav-link">Trade</Link>
          <Link to="/faucet" className="nav-link">Faucet</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
      </div>
    </nav>
  );
});

export default Navbar; 
