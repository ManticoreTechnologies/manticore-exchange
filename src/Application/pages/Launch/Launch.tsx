import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Launch.css';

type AssetType = 'main' | 'sub' | 'unique' | 'qualifier' | 'sub_qualifier' | 'restricted' | 'messaging_channel';

interface AssetFormData {
    assetType: AssetType;
    assetName: string;
    quantity: number;
    toAddress: string;
    changeAddress: string;
    units: number;
    reissuable: boolean;
    hasIpfs: boolean;
    ipfsHash: string;
    verifier?: string; // Only for restricted assets
}

const Launch: React.FC = () => {
    const { isAuthenticated, userAddress } = useAuth();
    const [formData, setFormData] = useState<AssetFormData>({
        assetType: 'main',
        assetName: '',
        quantity: 1,
        toAddress: '',
        changeAddress: '',
        units: 0,
        reissuable: true,
        hasIpfs: false,
        ipfsHash: '',
        verifier: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            // Reset certain fields based on asset type
            ...(name === 'assetType' && {
                units: value === 'unique' ? 0 : prev.units,
                reissuable: value === 'unique' ? false : prev.reissuable,
                quantity: value === 'unique' ? 1 : prev.quantity
            })
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement asset creation logic using blockchain API
        console.log('Asset creation form data:', formData);
    };

    const getAssetNamePrefix = () => {
        switch (formData.assetType) {
            case 'qualifier':
            case 'sub_qualifier':
                return '#';
            case 'restricted':
                return '$';
            default:
                return '';
        }
    };

    return (
        <div className="launch-container">
            <h1>Create New Asset</h1>
            <div className="launch-content">
                <form onSubmit={handleSubmit} className="asset-form">
                    <div className="form-group">
                        <label>Asset Type</label>
                        <select 
                            name="assetType" 
                            value={formData.assetType}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="main">Main Asset (500.00000000 EVR)</option>
                            <option value="sub">Sub Asset (100.00000000 EVR)</option>
                            <option value="unique">Unique Asset (5.00000000 EVR)</option>
                            <option value="messaging_channel">Messaging Channel Asset (100.00000000 EVR)</option>
                            <option value="qualifier">Qualifier Asset (1000.00000000 EVR)</option>
                            <option value="sub_qualifier">Sub Qualifier Asset (100.00000000 EVR)</option>
                            <option value="restricted">Restricted Asset (1500.00000000 EVR)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Asset Name</label>
                        <div className="asset-name-input">
                            {getAssetNamePrefix() && (
                                <span className="asset-prefix">{getAssetNamePrefix()}</span>
                            )}
                            <input
                                type="text"
                                name="assetName"
                                value={formData.assetName}
                                onChange={handleInputChange}
                                placeholder="Enter asset name"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {formData.assetType !== 'unique' && (
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                                className="form-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>To Address (Optional)</label>
                        <input
                            type="text"
                            name="toAddress"
                            value={formData.toAddress}
                            onChange={handleInputChange}
                            placeholder="Address to receive the asset"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Change Address (Optional)</label>
                        <input
                            type="text"
                            name="changeAddress"
                            value={formData.changeAddress}
                            onChange={handleInputChange}
                            placeholder="Address for EVR change"
                            className="form-input"
                        />
                    </div>

                    {!['qualifier', 'sub_qualifier', 'unique'].includes(formData.assetType) && (
                        <div className="form-group">
                            <label>Units (Decimal Places)</label>
                            <input
                                type="number"
                                name="units"
                                value={formData.units}
                                onChange={handleInputChange}
                                min="0"
                                max="8"
                                className="form-input"
                            />
                        </div>
                    )}

                    {!['qualifier', 'sub_qualifier', 'unique'].includes(formData.assetType) && (
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="reissuable"
                                    checked={formData.reissuable}
                                    onChange={handleInputChange}
                                />
                                Reissuable
                            </label>
                        </div>
                    )}

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="hasIpfs"
                                checked={formData.hasIpfs}
                                onChange={handleInputChange}
                            />
                            Has IPFS Hash
                        </label>
                    </div>

                    {formData.hasIpfs && (
                        <div className="form-group">
                            <label>IPFS Hash</label>
                            <input
                                type="text"
                                name="ipfsHash"
                                value={formData.ipfsHash}
                                onChange={handleInputChange}
                                placeholder="Enter IPFS hash"
                                className="form-input"
                            />
                        </div>
                    )}

                    {formData.assetType === 'restricted' && (
                        <div className="form-group">
                            <label>Verifier String</label>
                            <input
                                type="text"
                                name="verifier"
                                value={formData.verifier}
                                onChange={handleInputChange}
                                placeholder="Enter verifier string (e.g., #KYC & !#AML)"
                                className="form-input"
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-button">
                        Create Asset
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Launch; 