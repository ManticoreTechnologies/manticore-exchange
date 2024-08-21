// src/pages/BankPage.tsx
import React from 'react';
import '../styles/BankPage.css';
import logo from '../images/logo.png';

const BankPage: React.FC = () => {
    return (
        <div className="bank-page">
            <div className="title-bar">
                <h1 className="title">Manticore Asset Banking System</h1>
                <a href="/blog" className="learn-more">Learn More...</a>
            </div>
            <div className="temple">
                <div className="roof">
                    <img src={logo} alt="Site Logo" className="temple-logo" />
                </div>
                <div className="pillars">
                    <button className="pillar" onClick={() => alert('View your stored assets in the bank')}>
                        <span className="pillar-text">View Banks</span>
                    </button>
                    <button className="pillar" onClick={() => alert('Store your assets in the bank')}>
                        <span className="pillar-text">Store Assets</span>
                    </button>
                    <button className="pillar" onClick={() => alert('Create sub assets (bank keys)')}>
                        <span className="pillar-text">Manage Keys</span>
                    </button>
                    <button className="pillar" onClick={() => alert('Use keys to view other stored assets')}>
                        <span className="pillar-text">Transfer Banks</span>
                    </button>
                </div>
                <div className="steps">
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                </div>  
            </div>
        </div>
    );
};

export default BankPage;






