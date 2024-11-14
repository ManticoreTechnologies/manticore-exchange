import React from 'react';
import '../BlogPost.css';
import bitcoinLogo from '../../../images/bitcoin_logo.png';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const BitcoinExplainer: React.FC = () => {
  return (
    <div className='page-container'>
      <div className='container'>
        <div id="welcome">
          <h1 className="header">The Greatest Bitcoin Explainer Ever Written <img src={bitcoinLogo} alt="Bitcoin Logo" className="logo" /></h1>
          <p className="paragraph">Bitcoin is often described as digital gold, but it’s so much more than that. To truly understand Bitcoin, let’s break it down into its essence and explore what makes it revolutionary.</p>
        </div>

        <div id="what-is-bitcoin">
          <h2 className="sub-header">1. What is Bitcoin?</h2>
          <p className="paragraph">Bitcoin is a decentralized digital currency. It’s money you can send anywhere in the world without needing a bank or government to verify the transaction. Instead, Bitcoin uses a network of computers and a clever system called the <span className="blog-tooltip" data-tooltip-id="blockchain-tooltip" data-tooltip-content="A blockchain is a public ledger of all Bitcoin transactions, secured using cryptography. It ensures transparency, immutability, and decentralization by linking transaction blocks in a chain.">blockchain</span> to make sure everything is secure and transparent.</p>
          <ReactTooltip id="blockchain-tooltip" place="top" className="react-tooltip" />
        </div>

        <div id="why-bitcoin">
          <h2 className="sub-header">2. Why Was Bitcoin Created?</h2>
          <p className="paragraph">Bitcoin was invented in 2008 by a mysterious person or group of people using the name <strong>Satoshi Nakamoto</strong>. At its core, Bitcoin was created to address two significant problems:</p>
          <ul>
            <li className="paragraph"><strong>Trust in centralized systems:</strong> Banks and governments control traditional money. If they fail or act unfairly, users have little recourse.</li>
            <li className="paragraph"><strong>Double-spending problem:</strong> In digital systems, how do you ensure someone can’t copy and spend the same unit of money twice? Bitcoin solved this without needing a middleman.</li>
          </ul>
        </div>

        <div id="blockchain-foundation">
          <h2 className="sub-header">3. The Blockchain: Bitcoin’s Foundation</h2>
          <p className="paragraph">The blockchain is like a public ledger—a record of every Bitcoin transaction ever made. But unlike a regular ledger, it’s:</p>
          <ul>
            <li className="paragraph"><strong>Decentralized:</strong> Stored across thousands of computers worldwide (nodes).</li>
            <li className="paragraph"><strong>Immutable:</strong> Once a transaction is added, it’s almost impossible to alter.</li>
            <li className="paragraph"><strong>Transparent:</strong> Anyone can verify transactions.</li>
          </ul>
          <p className="paragraph">Imagine each block in the blockchain as a page in a book. Once a page is written and added, it’s locked in place. The next page (block) is linked to the previous one, creating a chain.</p>
        </div>

        <div id="how-bitcoin-works">
          <h2 className="sub-header">4. How Does Bitcoin Work?</h2>
          <p className="paragraph">Here’s a simplified step-by-step explanation:</p>
          <ol>
            <li className="paragraph"><strong>Sending Bitcoin:</strong> Alice wants to send 1 Bitcoin to Bob. She creates a transaction using her Bitcoin wallet.</li>
            <li className="paragraph"><strong>Broadcasting:</strong> The transaction is broadcast to the Bitcoin network.</li>
            <li className="paragraph"><strong>Verification:</strong> Thousands of nodes check if Alice has enough Bitcoin and if her transaction is valid.</li>
            <li className="paragraph"><strong>Mining:</strong> Miners group transactions into a block and compete to solve a complex mathematical puzzle (Proof of Work). The first miner to solve it adds the block to the blockchain and earns a reward.</li>
            <li className="paragraph"><strong>Confirmation:</strong> Once the block is added, Bob receives his Bitcoin.</li>
          </ol>
        </div>

        <div id="security">
          <h2 className="sub-header">5. Why Is Bitcoin Secure?</h2>
          <p className="paragraph">Bitcoin’s security comes from:</p>
          <ul>
            <li className="paragraph"><strong>Proof of Work (PoW):</strong> Miners expend computational energy to secure the network, making attacks costly and difficult.</li>
            <li className="paragraph"><strong>Decentralization:</strong> No single point of failure.</li>
            <li className="paragraph"><strong>Cryptography:</strong> Transactions are encrypted, and wallets are protected by private keys that only the owner knows.</li>
          </ul>
        </div>

        <div id="what-makes-bitcoin-special">
          <h2 className="sub-header">6. What Makes Bitcoin Special?</h2>
          <ul>
            <li className="paragraph"><strong>Limited Supply:</strong> Only 21 million Bitcoin will ever exist, making it scarce like gold.</li>
            <li className="paragraph"><strong>Permissionless:</strong> You don’t need anyone’s approval to use it.</li>
            <li className="paragraph"><strong>Borderless:</strong> Works the same anywhere in the world.</li>
            <li className="paragraph"><strong>Censorship-resistant:</strong> No one can block or reverse your transactions.</li>
          </ul>
        </div>

        <div id="value">
          <h2 className="sub-header">7. Why Does Bitcoin Have Value?</h2>
          <p className="paragraph">Bitcoin’s value comes from trust, utility, and scarcity:</p>
          <ul>
            <li className="paragraph">It solves real-world problems (e.g., sending money without intermediaries).</li>
            <li className="paragraph">Its supply is fixed, unlike fiat currencies that can be printed endlessly.</li>
            <li className="paragraph">It’s becoming a store of value, like digital gold.</li>
          </ul>
        </div>

        <div id="future">
          <h2 className="sub-header">8. Bitcoin’s Potential Future</h2>
          <p className="paragraph">Bitcoin is more than a currency; it’s a movement. It’s paving the way for:</p>
          <ul>
            <li className="paragraph"><strong>Financial freedom:</strong> Especially in countries with unstable currencies.</li>
            <li className="paragraph"><strong>Digital innovation:</strong> Inspiring blockchain-based applications beyond money.</li>
            <li className="paragraph"><strong>A new global standard:</strong> As trust in traditional systems erodes, Bitcoin offers an alternative.</li>
          </ul>
        </div>

        <div className='divider'></div>

        <p className="paragraph">And there you have it—the greatest Bitcoin explainer ever written. Go forth and spread the knowledge!</p>
      </div>
    </div>
  );
};

export default BitcoinExplainer;
