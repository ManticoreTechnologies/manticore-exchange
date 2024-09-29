import React, { useState, useEffect } from 'react';
import '../../styles/AssetMinter.css';
import Tooltip from '../../____components/Tooltip';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
interface FormData {
  asset_name: string;
  qty: string;
  reissuable: boolean;
  units: string;
  ipfs_hash?: string;
}

interface ReceiptData {
  receipt_id: number;
  address: string;
  amount: number;
  data: any;
  status: string;
  type: string;
  generated_at: string;
}

interface ValidityParams {
  pattern?: string;
  min?: number;
  max?: number;
  minLength?: number;
}

const AssetMinter: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    asset_name: '',
    qty: '',
    reissuable: true,
    units: '',
    ipfs_hash: '',
  });
/*  const [defaultData, setDefaultData] = useState<FormData>({
    asset_name: '',
    qty: '',
    reissuable: true,
    units: '',
    ipfs_hash: '',
  });
*/
  const [hasIpfs, setHasIpfs] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);     
  isFormValid
  const validityParams: { [key: string]: ValidityParams } = {
    asset_name: { pattern: '^[A-Za-z0-9._]*$', minLength: 3 },
    qty: { min: 0, max: 10000000000 },
    units: { min: 0, max: 8 },
    ipfs_hash: { pattern: '^[A-Za-z0-9]*$' },
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      const tooltip = new Tooltip(input.nextElementSibling as HTMLElement);
      const params = validityParams[input.name] || {};
      params
      tooltip
    });

    // Initial form validity check
    setIsFormValid(document.querySelector('form')!.checkValidity());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    setIsFormValid((document.querySelector('form') as HTMLFormElement).checkValidity());
  };

  const handleIpfsChange = () => {
    setHasIpfs(!hasIpfs);
    if (!hasIpfs) {
      setFormData(prevData => ({ ...prevData, ipfs_hash: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ipfs_hash, ...data } = formData;
    //if (hasIpfs) {
     // data.ipfs_hash = formData.ipfs_hash;
    //}

    try {
      const response = await fetch(`${apiUrl}/api/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const result: ReceiptData = await response.json();
      setReceipt(result);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
      setReceipt(null);
    }
  };

  return (
    <div className="minting-form-container">
      <h2>Mint Asset</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label className="tooltip">
          Asset Name:
          <input
            type="text"
            id="asset_name"
            name="asset_name"
            value={formData.asset_name}
            onChange={handleChange}
            placeholder="A-Z 0-9 . or _"
            title="Allowed characters: A-Z 0-9 . _"
            autoComplete='off'
            required
            minLength={3}
          />
          <span className="tooltiptext">Allowed characters: A-Z 0-9 . or _; Minimum length: 3</span>
        </label>
        <label className="tooltip">
          Quantity:
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            placeholder="0-10000000000"
            autoComplete='off'
            required
            title="Enter a quantity between 0 and 10,000,000,000"
          />
          <span className="tooltiptext">Enter a quantity between 0 and 10,000,000,000</span>
        </label>
        <label className="tooltip">
          <input
            type="checkbox"
            name="reissuable"
            checked={formData.reissuable}
            onChange={handleChange}
            className="styled-checkbox"
            autoComplete='off'
          />
          Reissuable
          <span className="tooltiptext">Check if the asset can be reissued</span>
        </label>
        <label className="tooltip">
          Units:
          <input
            type="number"
            name="units"
            value={formData.units}
            onChange={handleChange}
            placeholder="0-8"
            autoComplete='off'
            required
            title="Enter a number between 0 and 8"
          />
          <span className="tooltiptext">Enter a number between 0 and 8</span>
        </label>
        <label className="tooltip">
          <input type="checkbox" checked={hasIpfs} 
            className="styled-checkbox" onChange={handleIpfsChange} />
          Has IPFS Hash
          <span className="tooltiptext">Check if the asset has an IPFS hash</span>
        </label>
        {hasIpfs && (
          <label className="tooltip">
            IPFS Hash:
            <input
              type="text"
              name="ipfs_hash"
              value={formData.ipfs_hash || ''}
              onChange={handleChange}
              placeholder='QmVo5Kk5kNQ7qrDHM6VaYxwnqeHn7udKpRAHTLfMCr8HnA'
              autoComplete='off'
              title="Enter a valid IPFS hash"
            />
            <span className="tooltiptext">Enter a valid IPFS hash</span>
          </label>
        )}
        <button type="submit">Mint asset</button>
      </form>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      {receipt && (
        <div className="receipt">
          <h3>Invoice</h3>
          <p><strong>Invoice ID:</strong> {receipt.receipt_id}</p>
          <p><strong>Minting fee:</strong> {receipt.amount}</p>
          <p><strong>Pay to:</strong> {receipt.address}</p>
          <p><strong>Status:</strong> {receipt.status}</p>
          <p><strong>Type:</strong> {receipt.type}</p>
          <p><strong>Generated At:</strong> {receipt.generated_at}</p>
          <p><strong>Data:</strong> {JSON.stringify(receipt.data)}</p>
        </div>
      )}
    </div>
  );
};

export default AssetMinter;
