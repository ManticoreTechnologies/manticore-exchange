import React, { useEffect, useState } from 'react';
import '../../styles/FaucetPage.css'; // Assuming the CSS file is named FaucetPage.css
import axios, { AxiosError } from 'axios';
import api from '../../utility/api';
import logo from '../../images/Placeholder.webp';
import evr_logo from '../../images/evr_logo.svg';
const FaucetPage: React.FC = () => {
    const [faucetAddress, setFaucetAddress] = useState("");
    const manticoreFaucetAddress = "EaHp99kaAWKde7osRT69pRSyKR2QdCptVe"; //CHANGE BEFORE DEPLOYMENT
    const [currentEVRBalance, setCurrentEVRBalance] = useState(0);
    const [assets, setAssets] = useState<{ [key: string]: any[]}>({"Loading...": [0,logo]});
    const [responseMessage, setResponseMessage] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("example");

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFaucetAddress(event.target.value);
    };

    const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAsset(event.target.value);
    };

    useEffect(() => {
        console.log(manticoreFaucetAddress)
        const fetchBalances = async () => {
            try {
                // Fetch asset balances
                const assetResponse = await faucet_balances<any>();
                for(const asset in assetResponse){
                    console.log("Retrieving image for asset", asset)
                    const response = await api.node<any>('listassets', [asset, true]);
                    const assetData = response[asset] ? response[asset] : {ipfs_hash: false}
                    const balance = assetResponse[asset]
                    const imageUrl = assetData.has_ipfs && assetData.ipfs_hash ? `https://api.manticore.exchange:667/ipfs/cid/${assetData.ipfs_hash}` : logo;
                    assetResponse[asset] = [balance, asset=="EVR" ? evr_logo : imageUrl]
                }



                setAssets(assetResponse);
                if (Object.keys(assetResponse).length > 0) {
                    setSelectedAsset(Object.keys(assetResponse)[0]);
                }

                // Fetch EVR balance
                setCurrentEVRBalance(assetResponse['EVR'][0])
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const handleSubmit = async () => {
        try {
            const response = await faucet_request<any>(faucetAddress, selectedAsset)
            setResponseMessage(response.message);
        } catch (error: any) {
            if (error.toJSON().status==429) setResponseMessage('Sorry, you have no more requests today. Check again tomorrow!')
            else{
                setResponseMessage("Error: " + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <div className="faucet-page">
            <p>Send EVR or assets to "{manticoreFaucetAddress}" and we will add them to the faucet. </p>
            <p>Rate limit: 1 request per day | 0.01 payout per request</p>
            <p>Current EVR balance: {currentEVRBalance}</p>
            
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
            
            {responseMessage && (
                <div className="response-message">
                    {responseMessage}
                </div>
            )}
            
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            
            <h3>Assets and Balances</h3>
            <table>
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                {Object.entries(assets).map(([asset, data]) => (
                        <tr key={asset}>
                            <td className="asset-cell">
                                <a href={`/asset/${asset}?faucet=true`}>{asset === "EVR" ? "EVRMORE ($EVR)" : asset}</a>
                                <a href={`/asset/${asset}?faucet=true`}>
                                    <img style={{ maxHeight: 45 }} src={data[1]} alt={`${asset} logo`} />
                                </a>
                            </td>
                            <td>{data[0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



const faucet_request = async<T=unknown>(address: string, assetName: string)=>{
    const url = `https://api.manticore.exchange:8000/request`
    const body = {address, assetName}
    try{
        const response = await axios.post<T>(url, body);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError;
    }

}

const faucet_balances = async<T=unknown>()=>{
    const url = `https://api.manticore.exchange:8000/balance`
    try{
        const response = await axios.get<T>(url);
        return response.data;
    }catch(error){
        const axiosError = error as AxiosError;
        throw axiosError
    }
}


export default FaucetPage;
