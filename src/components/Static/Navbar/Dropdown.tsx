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
  showMore: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, toggleDropdown, showSearch, showTrade, showFaucet, showProfile, showMore }) => {
  return (
    <div className="dropdown" aria-expanded={isOpen}>
      <button 
        className="dropdown-toggle" 
        onClick={toggleDropdown} 
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        aria-haspopup="true"
      >
        <FaBars />
        <p>{showMore ? "More" : ""}</p>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <a href="/blog"><FaBlog className='dropdown-icon'/> Blog</a>
          <a href="/roadmap"><FaRoad className='dropdown-icon'/> Roadmap</a>
          <a href="/ipfs"><FaDatabase className='dropdown-icon'/> IPFS</a>
          <a href="/chart"><FaChartBar className='dropdown-icon'/> Chart</a>
          {!showProfile && (
            <a href="/profile"><FaUser className='dropdown-icon'/> Profile</a>
          )}
          {!showFaucet && (
            <a href="/faucet"><FaTint className='dropdown-icon'/> Faucet</a>
          )}
          {!showTrade && (
            <a href="/trade"><FaExchangeAlt className='dropdown-icon'/> Trade</a>
          )}
          {!showSearch && (
            <a href="/search"><FaSearch className='dropdown-icon'/> Search</a>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Dropdown;

