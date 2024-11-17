import React from 'react';
import { FaBars, FaBlog, FaRoad, FaDatabase, FaChartBar, FaUser, FaTint, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import './Dropdown.css';

interface DropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  showSearch: boolean;
  showTrade: boolean;
  showFaucet: boolean;
  showProfile: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, toggleDropdown, showSearch, showTrade, showFaucet, showProfile }) => {
  return (
    <div className="dropdown" aria-expanded={isOpen}>
      <button 
        className="dropdown-toggle" 
        onClick={toggleDropdown} 
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        aria-haspopup="true"
      >
        <FaBars />
        <p>More</p>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <a href="/blog"><FaBlog /> Blog</a>
          <a href="/roadmap"><FaRoad /> Roadmap</a>
          <a href="/ipfs"><FaDatabase /> IPFS</a>
          <a href="/chart"><FaChartBar /> Chart</a>
          {!showProfile && (
            <a href="/profile"><FaUser /> Profile</a>
          )}
          {!showFaucet && (
            <a href="/faucet"><FaTint /> Faucet</a>
          )}
          {!showTrade && (
            <a href="/trade"><FaExchangeAlt /> Trade</a>
          )}
          {!showSearch && (
            <a href="/search"><FaSearch /> Search</a>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Dropdown;

