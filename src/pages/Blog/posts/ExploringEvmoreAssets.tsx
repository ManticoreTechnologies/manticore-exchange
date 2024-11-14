import React from 'react';
import '../BlogPost.css';
import evrLogo from '../../../images/evr_logo_blue_400.svg';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ExploringEvrmoreAssets: React.FC = () => {
  return (
    <div className='page-container'>
      <div className='container'>
        <div id="welcome">
          <h1 className="header">Exploring Evrmore Assets <img src={evrLogo} alt="Evrmore Logo" className="logo" /></h1>
          <p className="paragraph">Welcome to the future of digital value! Evrmore is a blockchain platform designed to unlock innovative use cases, from social commerce to tokenized assets, offering unparalleled flexibility and security. Let’s dive into what makes Evrmore assets so powerful.</p>
        </div>

        <div id="basics">
          <h2 className="sub-header">1. What Are Evrmore Assets?</h2>
          <p className="paragraph">Evrmore assets are digital tokens that can represent virtually anything: physical goods, intellectual property, event tickets, in-game items, credentials, and more. Built on Evrmore’s robust Proof-of-Work blockchain, these assets boast:</p>
          <ul>
            <li className="paragraph"><strong>Decentralized Creation:</strong> Anyone can create assets without needing centralized approval.</li>
            <li className="paragraph"><strong>Unique Namespaces:</strong> Ensures every asset has a unique identifier.</li>
            <li className="paragraph"><strong>Divisibility Options:</strong> Choose divisible (like shares) or indivisible (like tickets) tokens.</li>
            <li className="paragraph"><strong>Metadata Attachment:</strong> Add additional data to customize and enhance functionality.</li>
          </ul>
        </div>

        <div className='divider'></div>

        <div id="importance">
          <h2 className="sub-header">2. Why Evrmore Assets Matter</h2>
          <p className="paragraph">Evrmore assets solve real-world problems with innovative solutions:</p>
          <ul>
            <li className="paragraph"><strong>Trustless Ownership:</strong> Verify ownership without intermediaries.</li>
            <li className="paragraph"><strong>Efficient Transfers:</strong> Transfer assets globally, instantly, and cheaply.</li>
            <li className="paragraph"><strong>Immutability:</strong> Asset data cannot be altered, ensuring security.</li>
            <li className="paragraph"><strong>Accessibility:</strong> User-friendly creation lowers the barrier for adoption.</li>
          </ul>
        </div>

        <div className='divider'></div>

        <div id="use-cases">
          <h2 className="sub-header">3. Key Use Cases of Evrmore Assets</h2>
          <h3 className="sub-sub-header">a. Tokenized Real-World Assets</h3>
          <p className="paragraph">Represent physical goods like real estate, commodities, and art as digital tokens.</p>

          <h3 className="sub-sub-header">b. Digital Goods and Intellectual Property</h3>
          <p className="paragraph">Monetize intellectual property through NFTs, licenses, royalties, and more.</p>

          <h3 className="sub-sub-header">c. Social Commerce</h3>
          <p className="paragraph">Empower creators with community tokens, crowdfunding, and social marketplaces.</p>

          <h3 className="sub-sub-header">d. Gaming and Virtual Worlds</h3>
          <p className="paragraph">Use Evrmore assets for in-game items, cross-game compatibility, and event tickets.</p>

          <h3 className="sub-sub-header">e. Credentials and Certifications</h3>
          <p className="paragraph">Issue tamper-proof digital credentials for education and professional certifications.</p>

          <h3 className="sub-sub-header">f. <span data-tooltip-id="defi-tooltip">Decentralized Finance (DeFi)</span></h3>
          <p className="paragraph">Power DeFi applications like asset-backed loans, tokenized securities, and staking rewards.</p>
        </div>

        <div className='divider'></div>

        <div id="metadata">
          <h2 className="sub-header">4. The Role of Metadata</h2>
          <p className="paragraph">Metadata adds flexibility and functionality to Evrmore assets:</p>
          <ul>
            <li className="paragraph">
              <strong data-tooltip-id="nft-tooltip">Dynamic NFTs:</strong> Tokens that evolve based on external inputs.
            </li>
            <li className="paragraph"><strong>Detailed Provenance:</strong> Track an asset's ownership history.</li>
            <li className="paragraph"><strong>Smart Contracts:</strong> Define rules like royalties or expiration dates.</li>
          </ul>
        </div>

        <div className='divider'></div>

        <div id="advantages">
          <h2 className="sub-header">5. Evrmore’s Advantage Over Alternatives</h2>
          <p className="paragraph">Evrmore excels with simplicity, efficiency, and security:</p>
          <ul>
            <li className="paragraph"><strong>Built for Assets:</strong> Specializes in token creation and transfer.</li>
            <li className="paragraph"><strong>Lower Fees:</strong> Cost-effective compared to Ethereum-based platforms.</li>
            <li className="paragraph"><strong>Enhanced Security:</strong> Uses Bitcoin’s proven Proof-of-Work model.</li>
          </ul>
        </div>

        <div className='divider'></div>

        <div id="future">
          <h2 className="sub-header">6. The Future of Evrmore Assets</h2>
          <p className="paragraph">Evrmore is poised to revolutionize social commerce, enabling creators to monetize directly and fostering community ownership through innovative tokenized solutions.</p>
        </div>

        <div className='divider'></div>

        <p className="paragraph">Are you ready to explore the next generation of digital value? <a className="blog-link" href="https://evrmore.com/">Evrmore</a> awaits your discovery!</p>
      </div>

      {/* Add tooltips */}
      <ReactTooltip
        id="nft-tooltip"
        place="top"
        content="Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of specific items or content on the blockchain."
      />
      <ReactTooltip
        id="defi-tooltip"
        place="top"
        content="Decentralized Finance (DeFi) refers to financial services and products built on blockchain technology, operating without traditional intermediaries like banks."
      />
    </div>
  );
};

export default ExploringEvrmoreAssets;
