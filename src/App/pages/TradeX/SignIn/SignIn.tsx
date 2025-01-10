import React, { useEffect, useState } from 'react';
import useWebSocket from '@/hooks/useWebSocket'; // Adjust the path as necessary
import './SignIn.css'; // Import CSS for styling and animations
import Cookies from 'js-cookie'; // Import Cookies for session management
import { FaArrowRight } from 'react-icons/fa';
const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

const SignIn: React.FC = () => {
    //@ts-ignore
    const [balances, setBalances] = useState<any[]>([]);
    const [address, setAddress] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    const [challenge, setChallenge] = useState('');
    const [step, setStep] = useState(1); // Track the current step
    const [sessionRestored, setSessionRestored] = useState(false); // New state to track session restoration
    const [remainingTime, setRemainingTime] = useState<number | null>(null); // New state for remaining time
    const [showInstructions, setShowInstructions] = useState(false);

    const { message, sendMessage } = useWebSocket(wsUrl);

    useEffect(() => {
        if (message) {
            console.log(message);
            if (message.includes("balances")) {
                setBalances(JSON.parse(message));
            } else if (message === "Invalid session") {
                Cookies.remove('userSession');
                Cookies.remove('address');
                authenticate();
            } else if (message.startsWith("auth_challenge")) {
                const challenge = message.split(" ")[1];
                setChallenge(challenge);
                setStep(2); // Move to the next step
            } else if (message.startsWith("authorized")) {
                Cookies.set('address', message.split(" ")[1], { sameSite: 'None', secure: true });
                Cookies.set('userSession', message.split(" ")[2], { sameSite: 'None', secure: true });
                alert("Authorized");
                setStep(3); // Move to a step indicating successful authorization
            } else if (message.startsWith("authorization_failed")) {
                alert("Authorization failed");
            } else if (message.startsWith("session_restored")) {
                const timeParts = message.split(" ")[1].split(":");
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                const seconds = parseFloat(timeParts[2]);
                const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                setRemainingTime(totalSeconds); // Set remaining time as a number
                setSessionRestored(true); // Set sessionRestored to true
                console.log("Session restored");
            }
        }
    }, [message]);

    useEffect(() => {
        if (remainingTime !== null) {
            const interval = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime !== null && prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(interval);
                        return prevTime;
                    }
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [remainingTime]);

    const authenticate = () => {
        sendMessage(`authorize ${address}`);
    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        authenticate();
    };

    const handleSignedMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignedMessage(event.target.value);
    };

    const handleSignedMessageSubmit = () => {
        sendMessage(`authorize_challenge ${signedMessage}`);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            const element = document.querySelector(`.copyable[data-text="${text}"]`);
            if (element) {
                element.classList.add('show-tooltip');
                setTimeout(() => {
                    element.classList.remove('show-tooltip');
                }, 1000); // Show for 1 second
            }
        }).catch(err => {
            console.error(`Failed to copy ${text}: `, err);
        });
    };

    return (
        <div className="signin-container">
            {sessionRestored ? (
                <div className="step-form">
                    <h2>Welcome Back!</h2>
                    <p>Your session has been successfully restored.</p>
                    {remainingTime !== null && (
                        <p>
                            You will need to re-authorize in {Math.floor(remainingTime / 3600)}h,
                            {Math.floor((remainingTime % 3600) / 60)}m,
                            {Math.round(remainingTime % 60)}s.
                        </p>
                    )}
                </div>
            ) : (
                <>
                    {step === 1 && (
                        <form onSubmit={handleSubmit} className="step-form">
                            <h2>Step 1: Enter Your Address</h2>
                            <label htmlFor="address">Enter Address:</label>
                            <input 
                                type="text" 
                                id="address" 
                                value={address} 
                                onChange={handleAddressChange} 
                                placeholder="Your Evrmore address"
                            />
                            <button type="submit" className="submit-icon">Next <FaArrowRight /></button>
                            
                            <button 
                                type="button"
                                className="help-button secondary"
                                onClick={() => setShowInstructions(!showInstructions)}
                            >
                                {showInstructions ? 'Hide Info' : 'What is this?'}
                            </button>
                            
                            <div className={`signing-instructions ${showInstructions ? 'show' : ''}`}>
                                <h3>About Address Signing Authentication</h3>
                                <p>Manticore uses a secure, decentralized authentication system:</p>
                                <ol>
                                    <li>Enter your Evrmore address</li>
                                    <li>We'll generate a unique challenge message</li>
                                    <li>Sign this message with your wallet to prove ownership</li>
                                    <li>No passwords needed - your wallet is your key!</li>
                                </ol>
                                <p className="info-note">This method ensures only the true owner of an address can access their account, as only they have the private keys needed to sign messages.</p>
                            </div>
                        </form>
                    )}
                    {step === 2 && (
                        <div className="step-form">
                            <h2>Step 2: Sign the Challenge</h2>
                            <p>Challenge: <span className="copyable" data-text={challenge} onClick={() => copyToClipboard(challenge)}>{challenge}</span></p>
                            <label htmlFor="signedMessage">Signed Message:</label>
                            <input 
                                type="text" 
                                id="signedMessage" 
                                value={signedMessage} 
                                onChange={handleSignedMessageChange} 
                                placeholder="Paste your signature here"
                            />
                            <button onClick={handleSignedMessageSubmit} className="submit-icon">Sign In <FaArrowRight /></button>
                            
                            <button 
                                className="help-button secondary"
                                onClick={() => setShowInstructions(!showInstructions)}
                            >
                                {showInstructions ? 'Hide Instructions' : 'How do I sign?'}
                            </button>
                            
                            <div className={`signing-instructions ${showInstructions ? 'show' : ''}`}>
                                <ol>
                                    <li>Open your Evrmore Core wallet</li>
                                    <li>Go to the console (Tools &gt; Debug Console)</li>
                                    <li>Unlock your wallet for 30 seconds:
                                        <div className="copyable" 
                                            onClick={() => copyToClipboard(`walletpassphrase "your-passphrase" 30`)}
                                            data-text={`walletpassphrase "your-passphrase" 30`}
                                        >
                                            walletpassphrase "your-passphrase" 30
                                        </div>
                                    </li>
                                    <li>Sign the message using this command:
                                        <div className="copyable" 
                                            onClick={() => copyToClipboard(`signmessage ${address} ${challenge}`)}
                                            data-text={`signmessage ${address} ${challenge}`}
                                        >
                                            signmessage {address} {challenge}
                                        </div>
                                    </li>
                                    <li>Copy the generated signature and paste it above</li>
                                </ol>
                            </div>
                            
                            <p className="address-display">Your Address: <span className="copyable" data-text={address} onClick={() => copyToClipboard(address)}>{address}</span></p>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="step-form">
                            <h2>Welcome Back!</h2>
                            <p>Your session has been successfully restored.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SignIn;
