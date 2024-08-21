import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css"; // Adjust the path as necessary if it changes
import logo from "../images/enhanced_logo_eyes.png"; // Adjust the path as necessary if it changes
import smallLogo from "../images/enhanced_logo_old.png"; // Path for the small logo
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssetsDropdownOpen, setIsAssetsDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isExplorerDropdownOpen, setIsExplorerDropdownOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAssetsDropdownToggle = () => {
    setIsAssetsDropdownOpen(!isAssetsDropdownOpen);
  };

  const handleToolsDropdownToggle = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
  };

  const handleExplorerDropdownToggle = () => {
    setIsExplorerDropdownOpen(!isExplorerDropdownOpen);
  };

  const handleDropdownMouseLeave = (dropdownSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    dropdownSetter(false);
  };

  return (
    <nav className="navbar">
      <NavLink to="/home" className="navbar-brand">
        <img src={logo} alt="Manticore Asset Exchange" className="navbar-logo" />
      </NavLink>
      <button className="navbar-toggle" onClick={handleToggle}>
        ☰
      </button>
      <ul className={`navbar-nav ${isOpen ? "navbar-nav-open" : ""}`}>
        <li className="nav-item dropdown">
          <button className="nav-link dropdown-toggle" onClick={handleAssetsDropdownToggle}>
            Assets
          </button>
          <ul
            className={`dropdown-menu ${isAssetsDropdownOpen ? "dropdown-open" : ""}`}
            onMouseLeave={() => handleDropdownMouseLeave(setIsAssetsDropdownOpen)}
          >
            <li className="dropdown-item">
              <NavLink to="/explorer" className="nav-link" onClick={handleToggle}>
                Explore
              </NavLink>
            </li>
            <li className="dropdown-item">
              <NavLink to="/wallet" className="nav-link" onClick={handleToggle}>
                Wallet
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button className="nav-link dropdown-toggle" onClick={handleToolsDropdownToggle}>
            Tools
          </button>
          <ul
            className={`dropdown-menu ${isToolsDropdownOpen ? "dropdown-open" : ""}`}
            onMouseLeave={() => handleDropdownMouseLeave(setIsToolsDropdownOpen)}
          >
            <li className="dropdown-item">
              <NavLink to="/generate" className="nav-link" onClick={handleToggle}>
                Name Generator
              </NavLink>
            </li>
            <li className="dropdown-item">
              <NavLink to="/mint" className="nav-link" onClick={handleToggle}>
                Mint
              </NavLink>
            </li>
            <li className="dropdown-item">
              <a href="https://mantiweb.com" target="_blank" rel="noopener noreferrer" className="nav-link" onClick={handleToggle}>
                Web Search
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button className="nav-link dropdown-toggle" onClick={handleExplorerDropdownToggle}>
            Explore
          </button>
          <ul
            className={`dropdown-menu ${isExplorerDropdownOpen ? "dropdown-open" : ""}`}
            onMouseLeave={() => handleDropdownMouseLeave(setIsExplorerDropdownOpen)}
          >
            <li className="dropdown-item">
              <NavLink to="/transactions" className="nav-link" onClick={handleToggle}>
                Transactions
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <NavLink to="/roadmap" className="nav-link" onClick={handleToggle}>
            Roadmap
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/blog" className="nav-link" onClick={handleToggle}>
            Blog
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/evr" className="nav-link" onClick={handleToggle}>
            EVR Chart
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/faucet" className="nav-link" onClick={handleToggle}>
            Faucet
          </NavLink>
        </li>
        <li className="nav-item">
          <a href={apiUrl} className="nav-link" onClick={handleToggle}>
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


