import React, { useRef, useEffect } from 'react';
import { FaBars, FaBlog, FaRoad, FaDatabase, FaChartBar, FaUser, FaTint, FaExchangeAlt, FaSearch, FaComments } from 'react-icons/fa';
import './navigation-dropdown.css';

interface DropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  showSearch: boolean;
  showTrade: boolean;
  showFaucet: boolean;
  showProfile: boolean;
  showMore: boolean;
  showChat: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, toggleDropdown, showSearch, showTrade, showFaucet, showProfile, showMore, showChat }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          toggleDropdown();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleDropdown]);

  return (
    <div className="manticore-nav-dropdown" aria-expanded={isOpen} ref={dropdownRef}>
      <button 
        className="manticore-nav-dropdown-toggle" 
        onClick={toggleDropdown} 
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        aria-haspopup="true"
      >
        <FaBars />
        <p>{showMore ? "More" : ""}</p>
      </button>
      {isOpen && (
        <div className="manticore-nav-dropdown-content">
          {/* <a href="/chat"><FaComments className='manticore-nav-dropdown-icon'/> Chat</a> */}
          <a href="/blog"><FaBlog className='manticore-nav-dropdown-icon'/> Blog</a>
          <a href="/roadmap"><FaRoad className='manticore-nav-dropdown-icon'/> Roadmap</a>
          <a href="/ipfs"><FaDatabase className='manticore-nav-dropdown-icon'/> IPFS</a>
          <a href="/chart"><FaChartBar className='manticore-nav-dropdown-icon'/> Chart</a>
          {!showProfile && (
            <a href="/profile"><FaUser className='manticore-nav-dropdown-icon'/> Profile</a>
          )}
          {!showFaucet && (
            <a href="/faucet"><FaTint className='manticore-nav-dropdown-icon'/> Faucet</a>
          )}
          {!showTrade && (
            <a href="/trade"><FaExchangeAlt className='manticore-nav-dropdown-icon'/> Trade</a>
          )}
          {!showSearch && (
            <a href="/search"><FaSearch className='manticore-nav-dropdown-icon'/> Search</a>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

