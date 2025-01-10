import React from 'react';
import './Faucet.css';
import HomeHero from '@/components/HomeHero/HomeHero';
import FaucetBalances from './Balances/FaucetBalances';

const Faucet: React.FC = () => {
    return (
        <div className="faucet-page">
            <HomeHero 
                title="Manticore" 
                subtitle="Faucet"
                body={
                    <>
                        Welcome to the Manticore Faucet! Click on any asset below to claim your free tokens and explore the power of decentralized assets.
                        <div style={{ fontSize: '0.8em', marginTop: '10px' }}>
                            Send EVR or assets to this address ETG4nTmZJx1ruP9RbcGnc9Bpm635PZVx7n and they will be added to the faucet.
                        </div>
                    </>
                } 
            />

            <FaucetBalances />
        </div>
    );
};

export default Faucet;
