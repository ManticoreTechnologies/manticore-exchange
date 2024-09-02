import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import '../../styles/components/NewestAssetsCarouselProps.css'; // Make sure this path is correct
import logo from '../../images/logo.png';

interface NewestAssetsCarouselProps {
  newAssets: any[];
  error: string | null; 
  settings: object;
}

const NewestAssetsCarousel: React.FC<NewestAssetsCarouselProps> = ({ newAssets, error, settings }) => {
  const [isDragging, setIsDragging] = useState(false);
  // Function to handle the mouse down (start dragging)
  const handleMouseDown = () => {
    setIsDragging(false); // Reset dragging state when the mouse is pressed down
  };

  // Function to handle drag start
  const handleDragStart = (event: React.DragEvent<HTMLAnchorElement | HTMLImageElement>) => {
    event.preventDefault(); // Prevent default drag behavior on the link and image
    setIsDragging(true); // Set dragging to true when a drag starts
  };

  // Function to handle clicks
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isDragging) {
      event.preventDefault(); // Prevent the click if dragging
    }
  };

  // Function to handle image error
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = logo; // Set the logo as the fallback image
  };

  return (
    <div className="carousel-container">
      <h2>Newly Minted Assets</h2>
      {error && <div className="error-message">{error}</div>}
      <Slider 
        {...settings} 
        beforeChange={() => setIsDragging(true)}
        afterChange={() => setIsDragging(false)}
      >
        {newAssets.map((asset, index) => (
          <div className="carousel-item" key={index}>
            <Link
              to={`/asset/${encodeURIComponent(asset[0])}`}
              className="asset-card-link"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onDragStart={handleDragStart}
            >
              <div className="asset-content">
                <img
                  src={asset[2] !== undefined ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${asset[2]}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` : logo}
                  className="newest-asset-image"
                  onDragStart={handleDragStart}
                  onError={handleImageError} // Handle image load error
                />
                <p>{asset[0]} | {asset[1]}</p>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewestAssetsCarousel;
