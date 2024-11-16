import React from 'react';
import { FaBars, FaBlog, FaRoad, FaDatabase, FaChartBar } from 'react-icons/fa';
import './Dropdown.css';

interface DropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, toggleDropdown }) => {
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
        </div>
      )}
    </div>
  );
};

export default Dropdown;

