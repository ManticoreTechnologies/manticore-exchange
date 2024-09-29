import { useState } from 'react';
import axios from 'axios';
import './Ipfs.css'; // Create a separate CSS file for the styles

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
    <div className="ipfs-uploader-container">
      <h1 className="ipfs-uploader-title">Upload File to IPFS via Pinata</h1>
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button onClick={handleUpload} disabled={uploading} className="upload-button">
        {uploading ? 'Uploading...' : 'Upload to IPFS'}
      </button>
      {ipfsHash && (
        <div className="upload-success">
          <p>File uploaded successfully! IPFS Hash:</p>
          <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">
            {ipfsHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default IPFSUploader;
