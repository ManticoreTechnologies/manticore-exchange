import React from 'react';
import './ResultCard.css';
import placeholderImage from '../../../../images/Placeholder.webp'; // Import the placeholder image

interface ResultCardProps {
    name: string;
    blockHeight: number;
    blockHash: string;
    amount: number;
    ipfsHash?: string;
    reissuable: boolean;
    units: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
    name,
    blockHeight,
    blockHash,
    amount,
    ipfsHash,
    reissuable,
    units
}) => {
    // Helper function to truncate long strings
    const truncateString = (str: string, length: number) => {
        return str.length > length ? `${str.substring(0, length)}...` : str;
    };

    // Determine the image source
    const imageSrc = ipfsHash ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` : placeholderImage
        //? `https://api.manticore.exchange:667/ipfs/cid/${ipfsHash}` 
        //: placeholderImage;

    return (
        <div className="result-card">
            <a href={`https://manticore.exchange/asset/${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer">
                <img 
                    src={imageSrc} 
                    alt={name} 
                    className="result-image" 
                    onError={(e) => { 
                        (e.target as HTMLImageElement).src = placeholderImage; 
                    }} 
                />
            </a>
            <h3 title={name}>{truncateString(name, 20)}</h3> {/* Truncate name and add tooltip */}
            <p><strong>Block Height:</strong> {blockHeight}</p>
            <p><strong>Block Hash:</strong> {truncateString(blockHash, 10)}</p>
            <p><strong>Amount:</strong> {amount}</p>
            {ipfsHash && <p><strong>IPFS Hash:</strong> {truncateString(ipfsHash, 10)}</p>}
            <p><strong>Reissuable:</strong> {reissuable ? 'Yes' : 'No'}</p>
            <p><strong>Units:</strong> {units}</p>
        </div>
    );
};

export default ResultCard;
