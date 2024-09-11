import React, { useEffect, useState } from 'react';
import './Faucet.css'; // Assuming the CSS file is named FaucetPage.css
import axios, { AxiosError } from 'axios';
import logo from '../images/Placeholder.webp'; // Default logo
import evr_logo from '../images/evr_logo.svg'; // EVR logo

const faucet_api_host = 'api.manticore.exchange';
const faucet_api_port = 669;
const faucet_api_url = `https://${faucet_api_host}:${faucet_api_port}`;

const Faucet: React.FC = () => {
    const [faucetAddress, setFaucetAddress] = useState("");
    const manticoreFaucetAddress = "EaHp99kaAWKde7osRT69pRSyKR2QdCptVe"; // CHANGE BEFORE DEPLOYMENT
    const [currentEVRBalance, setCurrentEVRBalance] = useState(0);
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

                // Set the EVR balance from the asset response if it's available
                if (assetResponse['EVR']) {
                    setCurrentEVRBalance(assetResponse['EVR'].balance);
                }

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
        <div className="faucet-page">
            <h1>Faucet</h1>
            <p>
                Send EVR or assets to "{manticoreFaucetAddress}" and we will add them to the faucet.
                Rate limit: 10 requests per day | 0.1 payout per request
            </p>

            <div className="faucet-details">
                <h2>Current EVR Balance</h2>
                <p>{currentEVRBalance}</p>
            </div>

            <div className="faucet-form">
                <h2>Request Assets</h2>
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
            </div>

            {responseMessage && (
                <div className="response-message">
                    {responseMessage}
                </div>
            )}

            <div className="assets-list">
                <h3>Assets and Balances</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(assets).map(([asset, data]: any) => (
                            <tr key={asset}>
                                <td className="asset-cell">
                                    <a href={`/asset/${asset}?faucet=true`}>
                                        {asset === "EVR" ? "EVRMORE ($EVR)" : asset}
                                    </a>
                                    <a href={`/asset/${asset}?faucet=true`}>
                                        <img 
                                            style={{ maxHeight: 45 }} 
                                            src={asset === "EVR" ? evr_logo : (data.ipfs_hash ? `https://api.manticore.exchange:667/ipfs/cid/${data.ipfs_hash}` : logo)} 
                                            alt={`${asset} logo`} 
                                        />
                                    </a>
                                </td>
                                <td>{data.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

export default Faucet;
