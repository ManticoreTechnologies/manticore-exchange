import React, { useState } from "react";
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

          <NavLink to="/search" className="nav-link animated-link" onClick={handleLinkClick}>
            <div className="nav-link-container">
              <i className="fas fa-search"></i>
              <p>Search</p>
            </div>
          </NavLink>

          <NavLink to="/trade" className="nav-link animated-link" onClick={handleLinkClick}>
            <div className="nav-link-container">
              <i className="fas fa-exchange-alt"></i>
              <p>Trade</p>
            </div>
          </NavLink>

          <NavLink to="/faucet" className="nav-link animated-link" onClick={handleLinkClick}> 
            <div className="nav-link-container">
              <i className="fas fa-tint"></i>
              <p>Faucet</p>
            </div>
          </NavLink>

          
          <Dropdown isOpen={isMenuOpen} toggleDropdown={handleMenuToggle} />
          
        <NavLink to="/profile" className="nav-link animated-link" onClick={handleLinkClick}>
          <div className="nav-link-container">
            <i className="fas fa-user"></i>
            <p>Profile</p>
          </div>
        </NavLink>
        
          </div>
      </div>
    </nav>
  );
};

export default Navbar;