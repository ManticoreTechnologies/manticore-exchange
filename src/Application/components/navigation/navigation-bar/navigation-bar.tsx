/* Manticore Technolgies 
(c) 2025
navigation-bar.tsx */

import Dropdown from "./navigation-dropdown/navigation-dropdown";
import React, { useEffect, useState } from "react";
import logo from '@/images/enhanced_logo_old.png';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./navigation-bar.css";

// Navbar component
const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);  
  const [showTrade, setShowTrade] = useState(true);
  const [showFaucet, setShowFaucet] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setShowSearch(window.innerWidth >= 700);
      setShowTrade(window.innerWidth >= 600);
      setShowFaucet(window.innerWidth >= 500);
      setShowProfile(window.innerWidth >= 450);
      setShowMore(window.innerWidth >= 450);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('manticore_cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        setCartCount(cartItems.length);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="manticore-nav-bar">
      <div className="manticore-nav-bar-content">
        <div className="manticore-nav-bar-logo">
          <img className="manticore-nav-bar-logo-img" src={logo} alt="Logo" onClick={handleLogoClick}/>
          <span className="manticore-nav-bar-logo-text" onClick={handleLogoClick}>MANTICORE</span>
        </div>

        <div className="manticore-nav-bar-links">
          {showSearch && (
            <NavLink to="/search" className="nav-link animated-link" onClick={handleLinkClick}>
              <div className="manticore-nav-bar-link-container">
                <i className="fas fa-search"></i>
                <p>Search</p>
              </div>
            </NavLink>
          )}
          {showTrade && (
            <NavLink to="/trade" className="nav-link animated-link" onClick={handleLinkClick}>
              <div className="manticore-nav-bar-link-container">
                <i className="fas fa-exchange-alt"></i>
                <p>Trade</p>
              </div>
            </NavLink>
          )}
          {showFaucet && (
            <NavLink to="/faucet" className="nav-link animated-link" onClick={handleLinkClick}> 
              <div className="manticore-nav-bar-link-container">
                <i className="fas fa-tint"></i>
                <p>Faucet</p>
              </div>
            </NavLink>
          )}
          
          <Dropdown 
            showMore={showMore}
            isOpen={isMenuOpen} 
            toggleDropdown={handleMenuToggle} 
            showSearch={showSearch} 
            showTrade={showTrade} 
            showFaucet={showFaucet}
            showChat={false}
            showProfile={showProfile} 
          />

          {showProfile && (
            <NavLink to="/profile" className="nav-link animated-link" onClick={handleLinkClick}>
              <div className="manticore-nav-bar-link-container">
                <i className="fas fa-user"></i>
                <p>Profile</p>
              </div>
            </NavLink>
          )}
        
          <NavLink to="/cart" className="nav-link animated-link manticore-nav-bar-cart-link">
            <FiShoppingCart />
            {cartCount > 0 && (
              <span className="manticore-nav-bar-cart-badge">{cartCount}</span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


/* MOONPAY WIDGET

        <MoonPayBuyWidget
        variant="overlay"
        baseCurrencyCode="usd"
        baseCurrencyAmount="100"
        defaultCurrencyCode="eth"
        walletAddress="0x0000000000000000000000000000000000000000"
        visible={visible}
        />
        <button onClick={() => setVisible(!visible)}>

        Toggle widget
        </button>

*/