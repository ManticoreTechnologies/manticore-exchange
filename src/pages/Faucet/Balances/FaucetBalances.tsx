import React, { useEffect, useState } from 'react';
import './FaucetBalances.css'; // Assuming the CSS file is named FaucetPage.css
import axios, { AxiosError } from 'axios';
import logo from '../../../images/Placeholder.webp'; // Default logo
import evr_logo from '../../../images/evr_logo.svg'; // EVR logo

const faucet_api_host = import.meta.env.VITE_FAUCET_API_HOST || 'api.manticore.exchange';
const faucet_api_port = import.meta.env.VITE_FAUCET_API_PORT || '669';
const faucet_api_proto = import.meta.env.VITE_FAUCET_API_PROTO || 'https';
const faucet_api_url = `${faucet_api_proto}://${faucet_api_host}:${faucet_api_port}`;

const FaucetBalances: React.FC = () => {
    const [assets, setAssets] = useState<{ [key: string]: any[] }>({ "Loading...": [0, logo] });

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const assetResponse = await faucet_balances<any>();
                setAssets(assetResponse);
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();
    }, []);

    return (
        <div className="assets-list">
            <table>
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(assets).map(([asset, data]: any) => (
                        <tr
                            key={asset}
                            style={{
                                backgroundImage: `url(${asset === "EVR" ? evr_logo : (data.ipfs_hash ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${data.ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` : logo)})`,
                            }}
                        >
                            <td className="asset-cell">
                                <a href={`/asset/${asset}?faucet=true`}>
                                    {asset === "EVR" ? "EVRMORE ($EVR)" : asset}
                                </a>
                            </td>
                            <td className="balance-cell">
                                <a href={`/asset/${asset}?faucet=true`}>
                                    {data.balance}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
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

export default FaucetBalances;
