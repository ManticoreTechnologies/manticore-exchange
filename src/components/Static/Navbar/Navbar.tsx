import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from '../../../images/enhanced_logo_old.png';
import { FiUser } from "react-icons/fi";
import { FaBars, FaChartLine, FaFile, FaRoad, FaBlog } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";

// Theme toggle button
const ThemeToggleButton: React.FC = () => {
  const [theme, setTheme] = useState(
    document.body.getAttribute("data-theme") || "dark"
  );



  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  return (
    <NavLink to="#" className="nav-link theme-toggle" onClick={toggleTheme}>
      {theme === "light" ? "☾" : "☀"}
    </NavLink>
  );
};

// Navbar component
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSearch, setShowSearch] = useState(true);  
  const [showTrade, setShowTrade] = useState(true);
  const [showFaucet, setShowFaucet] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
      setShowSearch(window.innerWidth >= 700);
      setShowTrade(window.innerWidth >= 600);
      setShowFaucet(window.innerWidth >= 500);
      setShowProfile(window.innerWidth >= 400);
      console.log(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Call handleResize initially in case the window size is already below 768px
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <img className="navbar-logo-img" src={logo} alt="Logo" />
          <span className="navbar-logo-text">MANTICORE</span>
        </div>

        <div className="navbar-links">
            <span>
              {showSearch && (
                <NavLink to="/search" className="nav-link animated-link" onClick={handleLinkClick}>
                  <div className="nav-link-container">
                    <i className="fas fa-search"></i>
                    <p>Search</p>
                  </div>
                </NavLink>
              )}
              {showTrade && (
                <NavLink to="/trade" className="nav-link animated-link" onClick={handleLinkClick}>
                  <div className="nav-link-container">
                    <i className="fas fa-exchange-alt"></i>
                    <p>Trade</p>
                  </div>
                </NavLink>
              )}
              {showFaucet && (
                <NavLink to="/faucet" className="nav-link animated-link" onClick={handleLinkClick}> 
                  <div className="nav-link-container">
                    <i className="fas fa-tint"></i>
                    <p>Faucet</p>
                  </div>
                </NavLink>
              )}
            </span>
          
          <Dropdown 
            isOpen={isMenuOpen} 
            toggleDropdown={handleMenuToggle} 
            showSearch={showSearch} 
            showTrade={showTrade} 
            showFaucet={showFaucet} 
            showProfile={showProfile} 
          />

          {showProfile && (
            <NavLink to="/profile" className="nav-link animated-link" onClick={handleLinkClick}>
              <div className="nav-link-container">
                <i className="fas fa-user"></i>
                <p>Profile</p>
              </div>
            </NavLink>
          )}
        
          </div>
      </div>
    </nav>
  );
};

export default Navbar;