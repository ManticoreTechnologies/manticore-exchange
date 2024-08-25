import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css"; // Adjust the path as necessary if it changes
import logo from "../images/enhanced_logo_eyes.png"; // Adjust the path as necessary if it changes
import smallLogo from "../images/enhanced_logo_old.png"; // Path for the small logo
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setOpenDropdown(null); // Close any open dropdown when toggling the navbar
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close the navbar in mobile view
    setOpenDropdown(null); // Close any open dropdown
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.navbar')) {
      setOpenDropdown(null);
      setIsOpen(false); // Optionally close the navbar as well if needed
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="navbar">
      <NavLink to="/home" className="navbar-brand" onClick={handleLinkClick}>
        <img src={logo} alt="Manticore Asset Exchange" className="navbar-logo" />
      </NavLink>
      <button className="navbar-toggle" onClick={handleToggle}>
        ☰
      </button>
      <ul className={`navbar-nav ${isOpen ? "navbar-nav-open" : ""}`}>
        <li className="nav-item dropdown">
          <button
            className="nav-link dropdown-toggle"
            onClick={() => handleDropdownToggle("assets")}
          >
            Assets
          </button>
          <ul
            className={`dropdown-menu ${openDropdown === "assets" ? "dropdown-open" : ""}`}
          >
            <li className="dropdown-item">
              <NavLink to="/explorer" className="nav-link" onClick={handleLinkClick}>
                Explore
              </NavLink>
            </li>
            <li className="dropdown-item">
              <NavLink to="/discover" className="nav-link" onClick={handleLinkClick}>
                Discover
              </NavLink>
            </li>
            <li className="dropdown-item">
              <NavLink to="/wallet" className="nav-link" onClick={handleLinkClick}>
                Wallet
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button
            className="nav-link dropdown-toggle"
            onClick={() => handleDropdownToggle("tools")}
          >
            Tools
          </button>
          <ul
            className={`dropdown-menu ${openDropdown === "tools" ? "dropdown-open" : ""}`}
          >
            <li className="dropdown-item">
              <NavLink to="/generate" className="nav-link" onClick={handleLinkClick}>
                Name Generator
              </NavLink>
            </li>
            <li className="dropdown-item">
              <NavLink to="/mint" className="nav-link" onClick={handleLinkClick}>
                Mint
              </NavLink>
            </li>
            <li className="dropdown-item">
              <a href="https://mantiweb.com" target="_blank" rel="noopener noreferrer" className="nav-link" onClick={handleLinkClick}>
                Web Search
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button
            className="nav-link dropdown-toggle"
            onClick={() => handleDropdownToggle("explore")}
          >
            Explore
          </button>
          <ul
            className={`dropdown-menu ${openDropdown === "explore" ? "dropdown-open" : ""}`}
          >
            <li className="dropdown-item">
              <NavLink to="/transactions" className="nav-link" onClick={handleLinkClick}>
                Transactions
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <NavLink to="/roadmap" className="nav-link" onClick={handleLinkClick}>
            Roadmap
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/blog" className="nav-link" onClick={handleLinkClick}>
            Blog
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/evr" className="nav-link" onClick={handleLinkClick}>
            EVR Info
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/faucet" className="nav-link" onClick={handleLinkClick}>
            Faucet
          </NavLink>
        </li>
        <li className="nav-item">
          <a href={apiUrl} className="nav-link" onClick={handleLinkClick}>
            API
          </a>
        </li>
      </ul>
      <div className="navbar-footer">
        <p className="navbar-footer-text">by Manticore Technologies</p>
        <img src={smallLogo} alt="Manticore Technologies" className="small-logo" />
      </div>
    </nav>
  );
};

export default Navbar;
