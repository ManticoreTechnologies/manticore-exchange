import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import Cookies from 'js-cookie';
import styles from './Wallet.module.css';

const Wallet = () => {
    const { message, sendMessage } = useWebSocket('ws://localhost:8765');
    const userSession = Cookies.get('userSession');
    const [balances, setBalances] = useState<{ [key: string]: number }>({});

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

    const handleDepositAsset = () => {
        sendMessage('deposit_asset USD 100');
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
                    <button onClick={handleDepositAsset}>Deposit USD</button>
                </div>
            ) : (
                <div>
                    <p className={styles.signInMessage}>🚫 Not authenticated. Please sign in. 🚫</p>
                    <button className={styles.signInButton}>Sign In</button>
                </div>
            )}
        </div>
    );
};

export default Wallet;
