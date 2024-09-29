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
    const manticoreFaucetAddress = "EaHp99kaAWKde7osRT69pRSyKR2QdCptVe"; // CHANGE BEFORE DEPLOYMENT
    const [assets, setAssets] = useState<{ [key: string]: any[] }>({ "Loading...": [0, logo] });
    const [responseMessage, setResponseMessage] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("example");

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFaucetAddress(event.target.value);
    };

    const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAsset(event.target.value);
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
    
                    <input 
                        className="faucet-address-input" 
                        placeholder="Enter a valid evrmore address" 
                        value={faucetAddress}
                        onChange={handleAddressChange}
                    />
                <select className="asset-select" value={selectedAsset} onChange={handleAssetChange}>
                    {Object.keys(assets).map((asset) => (
                        <option key={asset} value={asset}>
                            {asset}
                        </option>
                    ))}
                </select>
    
                   

                <button className="submit-button" onClick={handleSubmit}>Submit</button>

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
