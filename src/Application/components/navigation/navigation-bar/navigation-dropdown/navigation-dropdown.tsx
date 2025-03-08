import React, { useRef, useEffect } from 'react';
import { FaBars, FaBlog, FaRoad, FaDatabase, FaChartBar, FaUser, FaTint, FaExchangeAlt, FaSearch, FaComments, FaRocket } from 'react-icons/fa';
import './navigation-dropdown.css';

interface DropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  showSearch: boolean;
  showTrade: boolean;
  showFaucet: boolean;
  showProfile: boolean;
  showMore: boolean;
  showChat?: boolean;
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
    <div className="manticore-nav-dropdown dropdown-container" aria-expanded={isOpen} ref={dropdownRef}>
      <button 
        className={`manticore-nav-dropdown-toggle dropdown-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleDropdown} 
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        aria-haspopup="true"
      >
        <FaBars />
        <span>{showMore ? "More" : ""}</span>
      </button>
      {isOpen && (
        <div className="manticore-nav-dropdown-content dropdown-menu show">
          {/* Tech glow decoration */}
          <div className="dropdown-glow"></div>
          
          {/* <a href="/chat" className="dropdown-menu-item"><FaComments className='manticore-nav-dropdown-icon'/> Chat</a> */}
          <a href="/roadmap" className="dropdown-menu-item"><FaRoad className='manticore-nav-dropdown-icon'/> Roadmap</a>
          <a href="/ipfs" className="dropdown-menu-item"><FaDatabase className='manticore-nav-dropdown-icon'/> IPFS</a>
          <a href="/network" className="dropdown-menu-item"><FaChartBar className='manticore-nav-dropdown-icon'/> Network Status</a>
          <a href="/launch" className="dropdown-menu-item"><FaRocket className='manticore-nav-dropdown-icon'/> Launch Pad</a>
          {!showProfile && (
            <a href="/profile" className="dropdown-menu-item"><FaUser className='manticore-nav-dropdown-icon'/> Profile</a>
          )}
          {!showFaucet && (
            <a href="/faucet" className="dropdown-menu-item"><FaTint className='manticore-nav-dropdown-icon'/> Faucet</a>
          )}
          {!showTrade && (
            <a href="/trade" className="dropdown-menu-item"><FaExchangeAlt className='manticore-nav-dropdown-icon'/> Trade</a>
          )}
          {!showSearch && (
            <a href="/search" className="dropdown-menu-item"><FaSearch className='manticore-nav-dropdown-icon'/> Search</a>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

