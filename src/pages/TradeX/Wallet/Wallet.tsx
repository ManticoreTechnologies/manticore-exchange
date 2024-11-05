import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import Cookies from 'js-cookie';
import styles from './Wallet.module.css';
import { useNavigate, Link } from 'react-router-dom';

const Wallet = () => {
    const { message, sendMessage } = useWebSocket('ws://localhost:8765');
    const userSession = Cookies.get('userSession');
    const [balances, setBalances] = useState<{ [key: string]: number }>({});
    const [depositAddresses, setDepositAddresses] = useState<{ [key: string]: string }>({});
    const [loadingBalances, setLoadingBalances] = useState(true);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const navigate = useNavigate();
    const [depositAsset, setDepositAsset] = useState('usdc');
    const [depositAmount, setDepositAmount] = useState(100);
    const [withdrawAmount, setWithdrawAmount] = useState(100);

    useEffect(() => {
        if (message) {
            if (message.startsWith('all_balances ')) {
                const jsonString = message.replace('all_balances ', '').replace(/'/g, '"');
                try {
                    const balancesData = JSON.parse(jsonString);
                    setBalances(balancesData);
                    setLoadingBalances(false);
                } catch (error) {
                    console.error('Error parsing balances:', error);
                }
            } else if (message.startsWith('deposit_addresses ')) {
                const jsonString = message.replace('deposit_addresses ', '').replace(/'/g, '"');
                try {
                    const addressesData = JSON.parse(jsonString);
                    setDepositAddresses(addressesData);
                    setLoadingAddresses(false);
                } catch (error) {
                    console.error('Error parsing deposit addresses:', error);
                }
            }
        }
    }, [message]);

    useEffect(() => {
        if (userSession) {
            if (Object.keys(balances).length === 0) {
                sendMessage('get_all_balances');
            }
            if (Object.keys(depositAddresses).length === 0) {
                sendMessage('get_deposit_addresses');
            }
        }
    }, [userSession, sendMessage]);

    const handleDepositAsset = (asset: string, amount: number) => {
        sendMessage(`deposit_asset ${asset} ${amount}`);
    };

    const handleWithdrawAsset = (asset: string, amount: number) => {
        sendMessage(`withdraw_asset ${asset} ${amount}`);
    };

    const handleSignIn = () => {
        navigate('/tradex/signin');
    };

    return (
        <div className={styles.walletContainer}>
            <h1 className={styles.walletHeader}>Your Wallet</h1>
            {userSession ? (
                <div>
                    <div>
                        <Link to="#" className={styles.depositButton}>Deposit</Link>
                        <Link to="#" className={styles.withdrawButton}>Withdraw</Link>
                    </div>

                    {loadingBalances ? (
                        <p>Loading balances...</p>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th>Available</th>
                                        <th>Pending</th>
                                        <th>In Open Orders</th>
                                        <th>Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(balances).map(([asset, amount], index) => (
                                        <tr key={index}>
                                            <td>{asset}</td>
                                            <td>{amount}</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>≈${(amount * 1).toFixed(2)}</td>
                                            <td>
                                                <Link to="#" className={styles.depositButton} onClick={() => handleDepositAsset(asset, depositAmount)}>Deposit</Link>
                                                <Link to="#" className={styles.withdrawButton} onClick={() => handleWithdrawAsset(asset, withdrawAmount)}>Withdraw</Link>
                                                <Link to="#" className={styles.tradeButton}>Trade</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {loadingAddresses ? (
                        <p>Loading deposit addresses...</p>
                    ) : (
                        <div className={styles.depositAddresses}>
                            <h3>Deposit Addresses</h3>
                            {Object.entries(depositAddresses).map(([asset, address]) => (
                                <div key={asset}>
                                    <strong>{asset.toUpperCase()}: </strong>
                                    <span>{address}</span>
                                    <button onClick={() => navigator.clipboard.writeText(address)}>Copy</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <p className={styles.signInMessage}>🚫 Not authenticated. Please sign in. 🚫</p>
                    <Link to="/tradex/signin" className={styles.signInButton}>Sign In</Link>
                </div>
            )}
        </div>
    );
};

export default Wallet;
