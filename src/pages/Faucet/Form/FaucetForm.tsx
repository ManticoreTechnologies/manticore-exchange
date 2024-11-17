import React, { useEffect, useState } from 'react';
import './FaucetForm.css'; // Assuming the CSS file is named FaucetPage.css
import axios, { AxiosError } from 'axios';
import logo from '../../../images/Placeholder.webp'; // Default logo

const faucet_api_host = import.meta.env.VITE_FAUCET_API_HOST || 'api.manticore.exchange';
const faucet_api_port = import.meta.env.VITE_FAUCET_API_PORT || '669';
const faucet_api_proto = import.meta.env.VITE_FAUCET_API_PROTO || 'https';
const faucet_api_url = `${faucet_api_proto}://${faucet_api_host}:${faucet_api_port}`;

const FaucetForm: React.FC = () => {
    const [faucetAddress, setFaucetAddress] = useState("");
    const manticoreFaucetAddress = "ETG4nTmZJx1ruP9RbcGnc9Bpm635PZVx7n"; // CHANGE BEFORE DEPLOYMENT
    const [assets, setAssets] = useState<{ [key: string]: any[] }>({ "Loading...": [0, logo] });
    const [responseMessage, setResponseMessage] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("example");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFaucetAddress(event.target.value);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleAssetSelect = (asset: string) => {
        setSelectedAsset(asset);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        console.log(manticoreFaucetAddress);
        const fetchBalances = async () => {
            try {
                // Fetch the assets and their balances along with asset data from the backend
                const assetResponse = await faucet_balances<any>();
                setAssets(assetResponse);

       

                // Set the default selected asset (first in the list)
                if (Object.keys(assetResponse).length > 0) {
                    setSelectedAsset(Object.keys(assetResponse)[0]);
                }
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await faucet_request<any>(faucetAddress, selectedAsset);
            setResponseMessage(response.message);
        } catch (error: any) {
            if (error.toJSON().status === 429) {
                setResponseMessage('Sorry, you have no more requests today. Check again tomorrow!');
            } else {
                setResponseMessage("Error: " + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <div className="faucet-form">
            <div className="faucet-form-inputs">
                <input 
                    className="faucet-address-input" 
                placeholder="Enter a valid evrmore address" 
                value={faucetAddress}
                onChange={handleAddressChange}
            />
            <div className="custom-dropdown">
                <button className="dropdown-button" onClick={toggleDropdown}>
                    {selectedAsset}
                </button>
                {isDropdownOpen && (
                    <ul className="dropdown-list">
                        {Object.keys(assets).map((asset) => (
                            <li key={asset} onClick={() => handleAssetSelect(asset)}>
                                {asset}
                            </li>
                            ))}
                        </ul>
                    )}
                </div>
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>
            {responseMessage && (
                <div className="response-message">
                    {responseMessage}
                </div>
            )}
        </div>
    );
};

const faucet_request = async<T = unknown>(address: string, assetName: string) => {
    const url = `${faucet_api_url}/request`;
    const body = { address, assetName };
    try {
        const response = await axios.post<T>(url, body);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError;
    }
};

const faucet_balances = async<T = unknown>() => {
    const url = `${faucet_api_url}/balance`;
    try {
        const response = await axios.get<T>(url);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.cause;
    }
};

export default FaucetForm;
