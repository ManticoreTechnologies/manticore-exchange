import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import Cookies from 'js-cookie';
import styles from './Wallet.module.css';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
    const { message, sendMessage } = useWebSocket('ws://localhost:8765');
    const userSession = Cookies.get('userSession');
    const [balances, setBalances] = useState<{ [key: string]: number }>({});
    const navigate = useNavigate();
    const [depositAsset, setDepositAsset] = useState('USD');
    const [depositAmount, setDepositAmount] = useState(100);

    useEffect(() => {
        if (message) {
            console.log('Received message:', message);
            if (message.startsWith('all_balances:')) {
                const jsonString = message.replace('all_balances:', '').replace(/'/g, '"');
                try {
                    const balancesData = JSON.parse(jsonString);
                    setBalances(balancesData);
                } catch (error) {
                    console.error('Error parsing balances:', error);
                }
            }
        }
    }, [message]);

    useEffect(() => {
        if (userSession) {
            sendMessage('get_all_balances');
        }
    }, [userSession, sendMessage]);

    const handleDepositAsset = (asset: string, amount: number) => {
        sendMessage(`deposit_asset ${asset} ${amount}`);
    };

    const handleSignIn = () => {
        navigate('/tradex/signin');
    };

    return (
        <div className={styles.walletContainer}>
            <h1 className={styles.walletHeader}>Wallet</h1>
            {userSession ? (
                <div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(balances).map(([asset, amount], index) => (
                                    <tr key={index}>
                                        <td>{asset}</td>
                                        <td>{amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <input
                            type="text"
                            value={depositAsset}
                            onChange={(e) => setDepositAsset(e.target.value)}
                            placeholder="Asset"
                        />
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                            placeholder="Amount"
                        />
                        <button onClick={() => handleDepositAsset(depositAsset, depositAmount)}>
                            Deposit
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className={styles.signInMessage}>🚫 Not authenticated. Please sign in. 🚫</p>
                    <button className={styles.signInButton} onClick={handleSignIn}>Sign In</button>
                </div>
            )}
        </div>
    );
};

export default Wallet;
