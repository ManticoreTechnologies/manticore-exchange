import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from '../../../images/enhanced_logo_old.png';

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

  // Function to close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink to="/" className="navbar-logo" onClick={handleLinkClick}>
          <img src={logo} alt="Logo" />
          <span className="navbar-brand-text">MANTICORE</span>
        </NavLink>
        <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/search" className="nav-link" onClick={handleLinkClick}>
            Search
          </NavLink>
          <NavLink to="/trade" className="nav-link" onClick={handleLinkClick}>
            Trade
          </NavLink>
          <NavLink to="/faucet" className="nav-link" onClick={handleLinkClick}>
            Faucet
          </NavLink>
          <NavLink to="/blog" className="nav-link" onClick={handleLinkClick}>
            Blog
          </NavLink>
          <NavLink to="/roadmap" className="nav-link" onClick={handleLinkClick}>
            Roadmap
          </NavLink>
          <NavLink to="/chart" className="nav-link" onClick={handleLinkClick}>
            Chart
          </NavLink>
          <ThemeToggleButton />
        </div>
        <div className="navbar-actions">
          <button className="navbar-toggle" onClick={handleMenuToggle}>
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
