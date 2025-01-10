import { useState } from 'react';
import axios from 'axios';
import './Ipfs.css';

const IPFSUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setUploading(true);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const apiKey = '976225e936f428964feb';
    const apiSecret = '34c35dcf758a5d371913063a3ce8263e51ec41a00348092b67173b253a14fe93';


    let data = new FormData();
    data.append('file', file);

    try {
      const response = await axios.post(url, data, {
        maxContentLength: Infinity, 
        headers: {
          'Content-Type': `multipart/form-data`,
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });
      setIpfsHash(response.data.IpfsHash);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ipfs-container">
      <div className="ipfs-content">
        <h1 className="title">IPFS File Upload</h1>
        
        <div className="info-section">
          <h2>What is IPFS?</h2>
          <p>
            InterPlanetary File System (IPFS) is a peer-to-peer network for storing and sharing data in a distributed file system. 
            Files uploaded to IPFS receive a unique content identifier (CID) that can be used to retrieve the file from any IPFS node.
          </p>
          
          <h2>Minting with Evrmore Assets</h2>
          <p>
            Once you've uploaded your file to IPFS, you can use the generated hash to mint an Evrmore asset. Follow these steps:
          </p>
          <ol>
            <li>Upload your file and copy the IPFS hash</li>
            <li>Use the Evrmore wallet to create a new asset</li>
            <li>Include the IPFS hash in the asset's metadata</li>
            <li>The file will be permanently linked to your Evrmore asset</li>
          </ol>
        </div>

        <div className="upload-section">
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="file-input" 
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            Choose File
          </label>
          
          <button 
            onClick={handleUpload} 
            disabled={uploading} 
            className="upload-button"
          >
            {uploading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : 'Upload to IPFS'}
          </button>
        </div>

        {ipfsHash && (
          <div className="upload-success">
            <h3>File uploaded successfully! 🎉</h3>
            <p>IPFS Hash:</p>
            <a 
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hash-link"
            >
              {ipfsHash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPFSUploader;
