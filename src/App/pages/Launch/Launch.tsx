import React, { useState } from 'react';
import { FaInfoCircle, FaUpload, FaCoins, FaChartPie, FaClock, FaWater, FaLink, FaShieldAlt, FaCog, FaImage } from 'react-icons/fa';
import Tooltip from '@/components/Tooltip/Tooltip';
import './Launch.css';
import BasicInfoSection from '@/components/LaunchForm/sections/BasicInfoSection';
import EconomicsSection from '@/components/LaunchForm/sections/EconomicsSection';
import DistributionSection from '@/components/LaunchForm/sections/DistributionSection';
import VestingSection from '@/components/LaunchForm/sections/VestingSection';
import LiquiditySection from '@/components/LaunchForm/sections/LiquiditySection';
import ComplianceSection from '@/components/LaunchForm/sections/ComplianceSection';
import TechnicalSection from '@/components/LaunchForm/sections/TechnicalSection';

interface AssetParams {
  // Basic Asset Info
  name: string;
  symbol: string;
  description: string;
  category: string;
  tags: string;
  
  // Supply & Economics
  totalSupply: string;
  initialSupply: string;
  reissuable: boolean;
  divisibility: string; // Units/Decimals
  initialPrice: string;
  
  // Asset Metadata
  website: string;
  ipfsHash: string;
  whitepaper: string;
  socialLinks: {
    telegram: string;
    twitter: string;
    discord: string;
    github: string;
    medium: string;
  };
  
  // Asset Media
  logo: File | null;
  banner: File | null;
  
  // Asset Details
  tokenType: 'fungible' | 'non-fungible' | 'hybrid';
  tokenStandard: string;
  contractAddress: string;
  assetChannel: string;
  
  // Extended Economics
  saleType: 'public' | 'private' | 'presale';
  presalePrice: string;
  publicPrice: string;
  listingPrice: string;
  softCap: string;
  hardCap: string;
  minInvestment: string;
  maxInvestment: string;
  
  // Distribution
  teamAllocation: string;
  advisorAllocation: string;
  marketingAllocation: string;
  ecosystemAllocation: string;
  liquidityAllocation: string;
  publicSaleAllocation: string;
  
  // Vesting Details
  vestingSchedules: {
    team: {
      cliff: string;
      duration: string;
      interval: string;
      tge: string;
    };
    advisors: {
      cliff: string;
      duration: string;
      interval: string;
      tge: string;
    };
    publicSale: {
      cliff: string;
      duration: string;
      interval: string;
      tge: string;
    };
  };
  
  // Liquidity Details
  liquidityPair: string;
  liquidityLockDuration: string;
  initialLiquidity: string;
  
  // Compliance & Security
  kycProvider: string;
  auditProvider: string;
  restrictedCountries: string[];
  
  // Technical Parameters
  maxTransactionAmount: string;
  maxWalletAmount: string;
  transferDelay: string;
  transferFee: string;
  burnRate: string;
  
  // Governance
  votingRights: boolean;
  proposalThreshold: string;
  quorumRequirement: string;
  
  // Additional Features
  autoLiquidity: boolean;
  buybackEnabled: boolean;
  stakingEnabled: boolean;
  rewardToken: string;
  rewardRate: string;
}

const Launch: React.FC = () => {
  const [assetParams, setAssetParams] = useState<AssetParams>({
    name: '',
    symbol: '',
    description: '',
    category: '',
    tags: '',
    
    totalSupply: '',
    initialSupply: '',
    reissuable: false,
    divisibility: '8',
    initialPrice: '',
    
    website: '',
    ipfsHash: '',
    whitepaper: '',
    socialLinks: {
      telegram: '',
      twitter: '',
      discord: '',
      github: '',
      medium: ''
    },
    logo: null,
    banner: null,
    
    tokenType: 'fungible',
    tokenStandard: '',
    contractAddress: '',
    assetChannel: '',
    
    saleType: 'public',
    presalePrice: '',
    publicPrice: '',
    listingPrice: '',
    softCap: '',
    hardCap: '',
    minInvestment: '',
    maxInvestment: '',
    
    teamAllocation: '',
    advisorAllocation: '',
    marketingAllocation: '',
    ecosystemAllocation: '',
    liquidityAllocation: '',
    publicSaleAllocation: '',
    
    vestingSchedules: {
      team: {
        cliff: '',
        duration: '',
        interval: '',
        tge: ''
      },
      advisors: {
        cliff: '',
        duration: '',
        interval: '',
        tge: ''
      },
      publicSale: {
        cliff: '',
        duration: '',
        interval: '',
        tge: ''
      }
    },
    
    liquidityPair: '',
    liquidityLockDuration: '',
    initialLiquidity: '',
    
    kycProvider: '',
    auditProvider: '',
    restrictedCountries: [],
    
    maxTransactionAmount: '',
    maxWalletAmount: '',
    transferDelay: '',
    transferFee: '',
    burnRate: '',
    
    votingRights: false,
    proposalThreshold: '',
    quorumRequirement: '',
    
    autoLiquidity: false,
    buybackEnabled: false,
    stakingEnabled: false,
    rewardToken: '',
    rewardRate: ''
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement asset creation logic
    console.log('Asset parameters:', assetParams);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setAssetParams(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }

    // Handle nested object properties (e.g., vestingSchedules.team.cliff)
    if (name.includes('.')) {
      const parts = name.split('.');
      setAssetParams(prev => {
        const newState = { ...prev };
        let current: any = newState;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newState;
      });
      return;
    }

    setAssetParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sections = [
    {
      id: 'basic',
      title: 'Basic Info',
      icon: FaInfoCircle
    },
    {
      id: 'economics',
      title: 'Economics',
      icon: FaCoins
    },
    {
      id: 'distribution',
      title: 'Distribution',
      icon: FaChartPie
    },
    {
      id: 'vesting',
      title: 'Vesting',
      icon: FaClock
    },
    {
      id: 'liquidity',
      title: 'Liquidity',
      icon: FaWater
    },
    {
      id: 'media',
      title: 'Media & Links',
      icon: FaLink
    },
    {
      id: 'compliance',
      title: 'Compliance',
      icon: FaShieldAlt
    },
    {
      id: 'technical',
      title: 'Technical',
      icon: FaCog
    }
  ];

  const handleNextSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handlePrevSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <BasicInfoSection 
            values={assetParams}
            onChange={handleChange}
            isActive={true}
          />
        );
      case 'economics':
        return (
          <EconomicsSection 
            values={assetParams}
            onChange={handleChange}
            isActive={true}
          />
        );
      case 'distribution':
        return (
          <DistributionSection 
            values={assetParams}
            onChange={handleChange}
            isActive={true}
          />
        );
      case 'vesting':
        return (
          <VestingSection 
            values={assetParams}
            onChange={handleChange}
            isActive={true}
          />
        );
      case 'liquidity':
        return (
          <LiquiditySection 
            values={assetParams}
            onChange={handleChange}
            isActive={true}
          />
        );
      case 'media':
        return (
          <div className="form-section active">
            <h2>Media & Links</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">
                  Website
                  <Tooltip content="Your project's official website" />
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={assetParams.website}
                  onChange={handleChange}
                  placeholder="https://"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ipfsHash">
                  IPFS Hash
                  <Tooltip content="The IPFS hash for your asset's metadata" />
                </label>
                <div className="ipfs-input-wrapper">
                  <input
                    type="text"
                    id="ipfsHash"
                    name="ipfsHash"
                    value={assetParams.ipfsHash}
                    onChange={handleChange}
                    placeholder="QmHash..."
                  />
                  <a 
                    href="/ipfs" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ipfs-link"
                  >
                    Get IPFS Hash
                  </a>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="whitepaper">
                Whitepaper
                <Tooltip content="Link to your project's whitepaper (PDF or IPFS)" />
              </label>
              <input
                type="url"
                id="whitepaper"
                name="whitepaper"
                value={assetParams.whitepaper}
                onChange={handleChange}
                placeholder="https:// or ipfs://"
              />
            </div>

            <div className="social-links-grid">
              {Object.entries(assetParams.socialLinks).map(([platform, url]) => (
                <div className="form-group" key={platform}>
                  <label htmlFor={`social-${platform}`}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    <Tooltip content={`Your project's ${platform} link`} />
                  </label>
                  <input
                    type="url"
                    id={`social-${platform}`}
                    name={`socialLinks.${platform}`}
                    value={url}
                    onChange={handleChange}
                    placeholder={`https://${platform}.com/...`}
                  />
                </div>
              ))}
            </div>

            <div className="media-upload-section">
              <div className="form-group">
                <label>
                  Project Logo
                  <Tooltip content="Square logo, minimum 200x200px (PNG or SVG recommended)" />
                </label>
                <div className="media-upload-area">
                  {previewLogo ? (
                    <img src={previewLogo} alt="Logo preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <FaImage />
                      <span>Drop or click to upload logo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Project Banner
                  <Tooltip content="Banner image, recommended 1200x630px" />
                </label>
                <div className="media-upload-area banner">
                  {previewBanner ? (
                    <img src={previewBanner} alt="Banner preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <FaImage />
                      <span>Drop or click to upload banner</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <ComplianceSection 
            values={assetParams}
            onChange={handleChange}
            isActive={true}
          />
        );
      case 'technical':
        return (
          <TechnicalSection 
            values={assetParams}
            onChange={handleChange}
            isActive={true}
          />
        );
      // Add other cases for remaining sections
      default:
        return null;
    }
  };

  return (
    <div className="launch-container">
      <div className="launch-header">
        <h1>Launch Your EVR Asset</h1>
        <p>Create and configure your custom asset on the Evrmore blockchain</p>
      </div>

      <div className="launch-progress">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className={`progress-step ${activeSection === section.id ? 'active' : ''} ${index < sections.findIndex(s => s.id === activeSection) ? 'completed' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <section.icon />
            <span>{section.title}</span>
          </div>
        ))}
      </div>

      <form className="launch-form" onSubmit={handleSubmit}>
        {renderActiveSection()}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {activeSection !== sections[0].id && (
            <button
              type="button"
              className="nav-button prev"
              onClick={handlePrevSection}
            >
              Previous
            </button>
          )}
          
          {activeSection !== sections[sections.length - 1].id ? (
            <button
              type="button"
              className="nav-button next"
              onClick={handleNextSection}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="submit-button">
              Launch Asset
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Launch; 