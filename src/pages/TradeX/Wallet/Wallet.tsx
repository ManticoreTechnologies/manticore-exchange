import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useWebSocket from '../../../hooks/useWebSocket';
import Cookies from 'js-cookie';
import styles from './Wallet.module.css';
import { useNavigate, NavLink } from 'react-router-dom';
import UnAuthenticated from '../UnAuthenticated/UnAuthenticated';

// Registering the components
ChartJS.register(ArcElement, Tooltip, Legend);

const Wallet = () => {
    const { message, sendMessage, isConnected, isAuthenticated } = useWebSocket('ws://localhost:8765');
    const userSession = Cookies.get('userSession');
    const [balances, setBalances] = useState<{ [key: string]: number }>({});
    const [loadingBalances, setLoadingBalances] = useState(true);
    const navigate = useNavigate();
    const [depositAsset, setDepositAsset] = useState('usdc');
    const [depositAmount, setDepositAmount] = useState(100);
    const [withdrawAmount, setWithdrawAmount] = useState(100);

    useEffect(() => {
        if (message) {
            if (message.startsWith('all_balances ')) {
                const jsonString = message.replace('all_balances ', '').replace(/'/g, '"').replace("None", "0");
                try {
                    const balancesData = JSON.parse(jsonString);
                    setBalances(balancesData);
                    setLoadingBalances(false);
                } catch (error) {
                    console.error('Error parsing balances:', error);
                }
            }
        }
    }, [message]);

    useEffect(() => {
        if (userSession) {
            if (Object.keys(balances).length === 0) {
                sendMessage('get_all_balances');
            }
        }
    }, [userSession, sendMessage]);

    const handleDepositAsset = (asset, amount) => {
        sendMessage(`deposit_asset ${asset} ${amount}`);
    };

    const handleWithdrawAsset = (asset, amount) => {
        sendMessage(`withdraw_asset ${asset} ${amount}`);
    };

    const handleSignIn = () => {
        navigate('/tradex/signin');
    };

    const handleNavigateToDeposit = (asset) => {
        navigate(`/tradex/deposit/${asset}`);
    };

    const handleNavigateToWithdraw = (asset) => {
        navigate(`/tradex/withdraw/${asset}`);
    };

    // Prepare data for Pie chart
    const pieData = {
        labels: Object.keys(balances),
        datasets: [
            {
                data: Object.values(balances),
                backgroundColor: ['#FF0000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'],
                hoverBackgroundColor: ['#FF0000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'],
            },
        ],
    };

    return (
        <div className={styles.walletContainer}>
            {/* Pie Chart displaying balances */}
            <div className={styles.pieChartContainer}>
                <h3>Asset Distribution</h3>
                <div style={{ width: '50%', height: '50%' }}> {/* Set fixed width and height */}
                    <Pie data={pieData} />
                </div>
            </div>
            {isAuthenticated ? (
                <div>
                    <div>
                        <button className={styles.depositButton} onClick={() => handleNavigateToDeposit(depositAsset)}>Deposit</button>
                        <button className={styles.withdrawButton} onClick={() => handleNavigateToWithdraw(depositAsset)}>Withdraw</button>
                    </div>

                    {loadingBalances ? (
                        <p>Loading balances...</p>
                    ) : (
                        <>
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
                                                    <button className={styles.depositButton} onClick={() => handleNavigateToDeposit(asset)}>Deposit</button>
                                                    <button className={styles.withdrawButton} onClick={() => handleNavigateToWithdraw(asset)}>Withdraw</button>
                                                    <NavLink to="#" className={styles.tradeButton}>Trade</NavLink>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        </>
                    )}
                </div>
            ) : (
                <UnAuthenticated />
            )}
        </div>
    );
};

export default Wallet;




/*

To add a checkout button using coinbase commerce we can use the following code:

import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';

<Checkout productId='ab1fd09e-de80-441c-9e05-16d192f01067' > 
<CheckoutButton coinbaseBranded/>
<CheckoutStatus />
</Checkout>
*/
