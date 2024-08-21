import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Homepage.css'; // Ensure this path is correct
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../styles/Buttons.css';
import '../styles/Carousel.css'; // CSS for the carousel
import SubscriptionForm from '../components/SubscriptionForm'; // Import SubscriptionForm component
import RegisterUserModal from '../components/RegisterUserModal'; // Import the RegisterUserModal component
import Banner from '../components/Banner'; // Import the Banner component
import WalletConnect from '../components/WalletConnect'; // Import WalletConnect component
import api from '../utility/api';
import NewestAssetsCarousel from '../components/assets/NewestAssetsCarousel';
import logo from '../images/logo.png';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility
  const [assets, setAssets] = useState<any[]>([]); // State to store fetched assets
  const [newAssets, setNewAssets] = useState<any[]>([]); // State to store fetched assets
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get<any[]>("featured");
        setAssets(response);
      } catch (err) {
        setError("Failed to fetch featured assets. Please try again later.");
      }
    };

    const fetchNewAssets = async () => {
      try {
        const response = await api.get<any[]>("newest");
        setNewAssets(response);
      } catch (err) {
        setError("Failed to fetch new assets. Please try again later.");
      }
    };

    fetchAssets();
    fetchNewAssets();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const images = document.querySelectorAll('.featured-asset-image');
      images.forEach((img: any) => {
        if (!img.complete || img.naturalWidth === 0) {
          img.src = logo;
        }
      });
    }, 1000); // Set timeout to 1 second after page load

    return () => clearTimeout(timeoutId);
  }, [assets, newAssets]); // Re-run the effect if assets or newAssets change

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleWalletConnected = (address: string) => {
    console.log('Wallet connected:', address);
    // Handle wallet address if needed
  };

  return (
    <div className="homepage">
      <Banner /> {/* Add the Banner component here */}
      <NewestAssetsCarousel newAssets={newAssets} error={error} settings={settings} />
      <section className="hero">
        <h1>Welcome to Manticore Asset Exchange</h1>
        <p>Your premier destination for trading digital assets on the Evrmore blockchain.</p>
        <div className="hero-buttons">
          <button onClick={() => navigate('/explore')} className="explore-assets-button">Explore Evrmore Assets</button>
          <button onClick={openModal} className="register-user-button">Register User</button>
          <WalletConnect onWalletConnected={handleWalletConnected} /> {/* Link Wallet Button */}
          <button onClick={() => window.open('https://mantimerch.com', '_blank')} className="merch-shop-button">Visit Merch Shop</button> {/* New Merch Shop Button */}
        </div>
      </section>

      <RegisterUserModal isOpen={modalIsOpen} onRequestClose={closeModal} /> {/* Add the modal component */}

      <div className="content">
        <div className="main-content">
          <section className="features">
            <h2><Link to="/features">Our Features</Link></h2>
            <p>Discover the unique benefits and services we offer to enhance your trading experience.</p>
          </section>

          <section className="about">
            <h2><Link to="/about">About Us</Link></h2>
            <p>Learn more about Manticore Asset Exchange and our mission to provide a secure and efficient trading platform.</p>
          </section>

          <section className="contact">
            <h2><Link to="/contact">Contact Us</Link></h2>
            <p>Have questions or need support? Get in touch with our team for assistance.</p>
            
          </section>
          
          <SubscriptionForm /> {/* Add SubscriptionForm component here */}
        </div>

        <div className="carousels">
          <div className="carousel-container">
            <h2>Featured Assets</h2>
            {error && <div className="error-message">{error}</div>}
            <Slider {...settings}>
              {assets.map((asset, index) => (
                <Link key={index} to={`/asset/${encodeURIComponent(asset.name)}?query=${encodeURIComponent('yourQuery')}&page=${1}&showIPFSOnly=${false}`} className="asset-card-link disable-drag">
                  <div className="carousel-item featured-asset">
                    <img
                      className="featured-asset-image"
                      src={`https://api.manticore.exchange:8001/ipfs/cid/${asset.ipfs_hash}`}
                      alt={asset.name}
                    />
                    <p>{asset.name}</p>
                    <p>Amount: {asset.amount}</p>
                    <p>Reissuable: {asset.reissuable ? 'Yes' : 'No'}</p>
                    <p>Units: {asset.units}</p>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
