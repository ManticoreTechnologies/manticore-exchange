import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaSearch, FaExchangeAlt, FaFaucet, FaBlog } from 'react-icons/fa'; // Import icons from react-icons
import './Home.css'; // Ensure the correct CSS path
import logo from '../images/enhanced_logo.png'; // Import the logo (adjust path as necessary)

const Home: React.FC = () => {
  return (
    <div className="homepage">

      <section className="hero">
        <img src={logo} alt="Manticore Asset Exchange" className="hero-logo" /> {/* Add the logo */}
        <h1>Manticore Asset Exchange</h1>
        <p>Your premier destination for trading digital assets on the Evrmore blockchain.</p>
      </section>

      <div className="content">
        <div className="main-content">
          <div className="icons">
            <NavLink to="/search" className="icon-item">
              <FaSearch size={50} />
              <h3>Search</h3>
              <p>Explore a wide range of assets created on the Evrmore blockchain. Use our advanced search features to find exactly what you're looking for.</p>
              <span>Learn More</span>
            </NavLink>

            <NavLink to="/trade" className="icon-item">
              <FaExchangeAlt size={50} />
              <h3>Trade</h3>
              <p>Buy, sell, and exchange assets easily with our secure trading platform. Start trading today and take advantage of our user-friendly interface.</p>
              <span>Learn More</span>
            </NavLink>

            <NavLink to="/faucet" className="icon-item">
              <FaFaucet size={50} />
              <h3>Faucet</h3>
              <p>Need some assets to get started? Use our faucet to request free assets and kickstart your journey on the Evrmore blockchain.</p>
              <span>Learn More</span>
            </NavLink>

            <NavLink to="/blog" className="icon-item">
              <FaBlog size={50} />
              <h3>Blog</h3>
              <p>Stay updated with the latest news, insights, and updates from the Manticore Asset Exchange. Learn more about the future of digital assets and our platform.</p>
              <span>Learn More</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
