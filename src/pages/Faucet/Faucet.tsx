import React from 'react';
import './Faucet.css'; // Assuming the CSS file is named FaucetPage.css
import HomeHero from '../../components/Heros/HomeHero/HomeHero';
import FaucetForm from './Form/FaucetForm';
import FaucetBalances from './Balances/FaucetBalances';


const Faucet: React.FC = () => {

    return (
        <div className="faucet-page">

            {/* Hero */}
            <HomeHero 
                title="Manticore Faucet" 
                body={
                    <>
                        Welcome to the Manticore Faucet! Claim your free EVR and explore the power of decentralized assets.
                        <div style={{ fontSize: '0.8em', marginTop: '10px' }}>
                            Send EVR or assets to this address ETG4nTmZJx1ruP9RbcGnc9Bpm635PZVx7n and they will be added to the faucet.
                        </div>
                    </>
                } 
            />
           {/* Form */}
            <FaucetForm />

            {/* Table */}
            <FaucetBalances />

        </div>
    );
};

export default Faucet;
