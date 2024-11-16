import React from 'react';
import { FaBars } from 'react-icons/fa';

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
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

