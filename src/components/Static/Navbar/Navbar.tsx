import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from '../../../images/enhanced_logo_old.png';
import { FiUser } from "react-icons/fi";
import { FaBars, FaChartLine, FaFile, FaRoad, FaBlog } from "react-icons/fa";

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

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="Logo" />
      </div>
    </nav>
  );
};

export default Navbar;




/*
      <div className="navbar-content">
        <NavLink to="/" className="navbar-logo" onClick={handleLinkClick}>
          <img src={logo} alt="Logo" />
          <span className="navbar-brand-text">MANTICORE</span>
        </NavLink>

        <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/search" className="nav-link animated-link" onClick={handleLinkClick}>
            Search
          </NavLink>
          <NavLink to="/trade" className="nav-link animated-link" onClick={handleLinkClick}>
            Trade
          </NavLink>
          <NavLink to="/faucet" className="nav-link animated-link" onClick={handleLinkClick}>
            Faucet
          </NavLink>
          <div 
            className="dropdown" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            <button className="nav-link dropdown-toggle animated-link" onClick={handleMenuToggle}>
              More <FaBars />
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <NavLink to="/blog" className="dropdown-item animated-link" onClick={handleLinkClick}>
                  <FaBlog /> Blog
                </NavLink>
                <NavLink to="/roadmap" className="dropdown-item animated-link" onClick={handleLinkClick}>
                  <FaRoad /> Roadmap
                </NavLink>
                <NavLink to="/ipfs" className="dropdown-item animated-link" onClick={handleLinkClick}>
                  <FaFile /> IPFS
                </NavLink>
                <NavLink to="/chart" className="dropdown-item animated-link" onClick={handleLinkClick}>
                  <FaChartLine /> Chart
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/tradeX/profile" className="nav-link animated-link" onClick={handleLinkClick}>
            <FiUser />
          </NavLink>

          <ThemeToggleButton />
        </div>

        <div className="navbar-actions">
          <button className="navbar-toggle animated-link" onClick={handleMenuToggle}>
            ☰
          </button>
        </div>
      </div> 
 */