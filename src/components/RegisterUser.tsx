// src/components/RegisterUser.tsx

import React, { useState } from 'react';
import '../styles/RegisterUser.css'; // Ensure this path is correct

interface RegisterUserProps {}

const RegisterUser: React.FC<RegisterUserProps> = () => {
    const [address, setAddress] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    const [network, setNetwork] = useState('evrmore');
    const [result, setResult] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            address,
            public_key: publicKey,
            signed_message: signedMessage,
            network
        };

        try {
            const response = await fetch('https://api.manticore.exchange/api/register_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            console.log(response)
            if (response.ok) {
                const data = await response.json();
                setResult(JSON.stringify(data, null, 2));
            } else {
                const errorData = await response.json();
                setResult(JSON.stringify(errorData, null, 2));
            }
        } catch (error) {
            setResult('Error: ' + error);
        }
    };

    return (
        <div className="register-user-container">
            <h1 className="register-user-title">Register User</h1>
            <form onSubmit={handleSubmit} className="register-user-form">
                <div className="form-group">
                    <label htmlFor="address">Evrmore Address:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="publicKey">Public Key:</label>
                    <input
                        type="text"
                        id="publicKey"
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signedMessage">Signed Message:</label>
                    <input
                        type="text"
                        id="signedMessage"
                        value={signedMessage}
                        onChange={(e) => setSignedMessage(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="network">Network:</label>
                    <select
                        id="network"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        required
                    >
                        <option value="evrmore">Evrmore</option>
                        <option value="evrmore-testnet">Evrmore Testnet</option>
                        <option value="evrmore-regtest">Evrmore Regtest</option>
                    </select>
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
            {result && (
                <div className="result-container">
                    <h2>Result</h2>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
};

export default RegisterUser;

