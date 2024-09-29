import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/LaunchPage.css';
import { FaHome, FaExchangeAlt, FaWallet, FaChartPie } from 'react-icons/fa'; // Import icons from react-icons
import Subscribe from '../____components/Subscribe';
import logo from '../images/enhanced_logo.png'; // Adjust the path as necessary if it changes

const LaunchPage: React.FC = () => { 

  return (
    <div className="launch-page">
      <div className="hero-1">
        <div className="overlay"></div>
        <img src={logo} alt="Manticore Asset Exchange" className="hero-logo" />
        <h1>Manticore Asset Exchange</h1>
        <p>Your premier destination for trading digital assets on the Evrmore blockchain.</p>
        <div className="newsletter-form-hero">
          <Subscribe/>
        </div>
      </div>
      <div className="features">
        <h2>Our Features</h2>
        <p>We are currently working on:</p>
        <ul>
          <li>Secure and efficient trading platform</li>
          <li>Real-time asset tracking</li>
          <li>User-friendly interface</li>
          <li>Advanced analytics tools</li>
          <li>24/7 customer support</li>
        </ul>
        <button className="view-roadmap-button">
          <Link to="/roadmap">View Roadmap</Link>
        </button>
      </div>
      <div className="carousel-container">
        <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false} showStatus={false}>
          <div className="carousel-card">
            <h3>For Business</h3>
            <p>Our platform offers robust solutions tailored for businesses to manage and trade digital assets efficiently.</p>
            <Link to="/blog" className="carousel-button">Learn More</Link>
          </div>
          <div className="carousel-card">
            <h3>For Developer</h3>
            <p>Developers can leverage our advanced tools and APIs to build innovative solutions on the Evrmore blockchain.</p>
            <Link to="/blog" className="carousel-button">Learn More</Link>
          </div>
          <div className="carousel-card">
            <h3>For Individual</h3>
            <p>Individuals can easily trade, track, and manage their digital assets with our user-friendly interface.</p>
            <Link to="/blog" className="carousel-button">Learn More</Link>
          </div>
        </Carousel>
      </div>
      <div className="icons">
        <Link to="/home" className="icon-item">
          <FaHome size={50} />
          <h3>Home Page</h3>
          <p>Discover the main features and overview of our platform.</p>
          <span>Learn More</span>
        </Link>
        <Link to="/transactions" className="icon-item">
          <FaExchangeAlt size={50} />
          <h3>Transactions Page</h3>
          <p>Track all your transactions in real-time.</p>
          <span>Learn More</span>
        </Link>
        <Link to="/explore" className="icon-item">
          <FaChartPie size={50} />
          <h3>Assets Page</h3>
          <p>View and manage your assets efficiently.</p>
          <span>Learn More</span>
        </Link>
        <Link to="/wallet" className="icon-item">
          <FaWallet size={50} />
          <h3>Wallet Page</h3>
          <p>Securely store and manage your digital assets.</p>
          <span>Learn More</span>
        </Link>
      </div>
      <div className="newsletter">
        <h2>Stay Updated</h2>
        <p>Sign up for project updates and be the first to know about new features and releases.</p>
        <Subscribe/>
      </div>
    </div>
  );
};

export default LaunchPage;







