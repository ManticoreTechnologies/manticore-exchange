import { FiPlus, FiShoppingCart } from 'react-icons/fi';
import React from 'react';
import './TradingHeader.css';
import ManageListing from '../ManageListing/ManageListing';

const TradingHeader: React.FC<any> = ({createListing, toggleCartVisibility, cart}: any) => {
    return (
        <div className="trading-header">
            
            <ManageListing />

            <div className="list-icon-container" onClick={createListing}>
                <FiPlus className="list-icon" />
            </div>
            
            <div className="cart-icon-container" onClick={toggleCartVisibility}>
                <FiShoppingCart className="cart-icon" />
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </div>
            
        </div>

    );
};
export default TradingHeader;
