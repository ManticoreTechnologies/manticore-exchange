import React, { useEffect, useState } from 'react';
import useWebSocket from '@/hooks/useWebSocket';
import './SignIn.css';
import Cookies from 'js-cookie';
// @ts-ignore
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    // @ts-ignore
    const [balances, setBalances] = useState<any[]>([]);
    const [address, setAddress] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    const [challenge, setChallenge] = useState('');
    const [step, setStep] = useState(1);
    const [sessionRestored, setSessionRestored] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [challengeTime, setChallengeTime] = useState<number>(60);

    const { message, sendMessage } = useWebSocket(wsUrl);

    useEffect(() => {
        if (message) {
            console.log('Received message:', message);
            try {
                if (message.includes("balances")) {
                    setBalances(JSON.parse(message));
                    setError(null);
                } else if (message === "Invalid session") {
                    Cookies.remove('userSession');
                    Cookies.remove('address');
                    setError("Session expired. Please sign in again.");
                    setStep(1);
                } else if (message.startsWith("auth_challenge")) {
                    const challenge = message.split(" ")[1];
                    setChallenge(challenge);
                    setStep(2);
                    setError(null);
                    setIsLoading(false);
                    // Reset challenge timer when new challenge is received
                    setChallengeTime(60);
                } else if (message.startsWith("authorized")) {
                    const [_, userAddress, sessionToken] = message.split(" ");
                    Cookies.set('address', userAddress, { sameSite: 'None', secure: true });
                    Cookies.set('userSession', sessionToken, { sameSite: 'None', secure: true });
                    setStep(3);
                    setError(null);
                    setIsLoading(false);
                    // Redirect after successful authentication
                    setTimeout(() => {
                        navigate('/trade');
                    }, 1500);
                } else if (message.startsWith("authorization_failed")) {
                    setError("Authentication failed. Please check your signature and try again.");
                    setIsLoading(false);
                } else if (message.startsWith("session_restored")) {
                    const timeParts = message.split(" ")[1].split(":");
                    const hours = parseInt(timeParts[0], 10);
                    const minutes = parseInt(timeParts[1], 10);
                    const seconds = parseFloat(timeParts[2]);
                    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                    setRemainingTime(totalSeconds);
                    setSessionRestored(true);
                    setError(null);
                }
            } catch (err) {
                console.error('Error processing message:', err);
                setError("An error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    }, [message, navigate]);

    useEffect(() => {
        if (step === 2 && challengeTime > 0) {
            const timer = setInterval(() => {
                setChallengeTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setError("Challenge expired. Please try again.");
                        setStep(1);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [step, challengeTime]);

    const authenticate = () => {
        if (!address.trim()) {
            setError("Please enter your Evrmore address");
            return;
        }
        setIsLoading(true);
        setError(null);
        sendMessage(`authorize ${address}`);
    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
        setError(null);
    };

    const handleSignedMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignedMessage(event.target.value);
        setError(null);
    };

    const handleSignedMessageSubmit = () => {
        if (!signedMessage.trim()) {
            setError("Please enter the signed message");
            return;
        }
        setIsLoading(true);
        setError(null);
        sendMessage(`authorize_challenge ${signedMessage}`);
    };

    const copyToClipboard = (text: string) => {
        const cleanedText = text.replace(/\s+/g, ' ').trim(); // Clean up extra whitespace
        navigator.clipboard.writeText(cleanedText)
            .then(() => {
                // Find the element and show the tooltip
                const element = document.querySelector(`.copyable[data-text="${text}"]`);
                if (element) {
                    element.classList.add('show-tooltip');
                    setTimeout(() => {
                        element.classList.remove('show-tooltip');
                    }, 1000);
                }
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                // Fallback copy method for browsers that don't support clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = cleanedText;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    const element = document.querySelector(`.copyable[data-text="${text}"]`);
                    if (element) {
                        element.classList.add('show-tooltip');
                        setTimeout(() => {
                            element.classList.remove('show-tooltip');
                        }, 1000);
                    }
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                }
                document.body.removeChild(textArea);
            });
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-header">
                <button className="back-button" onClick={handleBack}>
                    ← Back
                </button>
                <div className="steps-indicator">
                    <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Add</span>
                    </div>
                    <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Verify</span>
                    </div>
                </div>
            </div>

            <div className="signin-container">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {sessionRestored ? (
                    <div className="step-form">
                        <h2>Welcome Back!</h2>
                        <p>Your session has been successfully restored.</p>
                        {remainingTime !== null && (
                            <p className="session-timer">
                                Session expires in: {Math.floor(remainingTime / 3600)}h{' '}
                                {Math.floor((remainingTime % 3600) / 60)}m{' '}
                                {Math.round(remainingTime % 60)}s
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        {step === 1 && (
                            <div className="step-form">
                                <h2>Enter Your Address</h2>
                                <div className="signature-input">
                                    <label htmlFor="address">Evrmore Address</label>
                                    <input 
                                        type="text" 
                                        id="address" 
                                        value={address} 
                                        onChange={handleAddressChange} 
                                        placeholder="Enter your Evrmore address"
                                        disabled={isLoading}
                                    />
                                </div>
                                
                                <button 
                                    onClick={authenticate}
                                    className="submit-icon"
                                    disabled={isLoading || !address.trim()}
                                >
                                    {isLoading ? 'Verifying...' : 'Continue'} {!isLoading && <FaArrowRight />}
                                </button>
                                
                                <button 
                                    type="button"
                                    className="help-button"
                                    onClick={() => setShowInstructions(!showInstructions)}
                                >
                                    {showInstructions ? 'Hide Information' : 'What is wallet authentication?'}
                                </button>
                                
                                <div className={`signing-instructions ${showInstructions ? 'show' : ''}`}>
                                    <h3>Secure Wallet Authentication</h3>
                                    <p>Manticore uses your Evrmore wallet for secure, password-less authentication:</p>
                                    <ol>
                                        <li>
                                            <strong>Enter Address</strong>
                                            <p>Provide your Evrmore wallet address</p>
                                        </li>
                                        <li>
                                            <strong>Sign Message</strong>
                                            <p>Sign a unique challenge with your wallet</p>
                                        </li>
                                        <li>
                                            <strong>Verify Ownership</strong>
                                            <p>Prove you own the address without sharing private keys</p>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        )}
                        
                        {step === 2 && (
                            <div className="step-form">
                                <h2>Sign the Challenge</h2>
                                <div className="challenge-container">
                                    <label>Challenge Message</label>
                                    <div 
                                        className="challenge-text"
                                        onClick={() => copyToClipboard(challenge)}
                                    >
                                        {challenge}
                                    </div>
                                    <div className={`challenge-timer ${challengeTime <= 30 ? 'warning' : ''} ${challengeTime <= 10 ? 'critical' : ''}`}>
                                        Time remaining: {challengeTime}s
                                    </div>
                                </div>

                                <div className="signature-input">
                                    <label htmlFor="signedMessage">Signature</label>
                                    <input 
                                        type="text" 
                                        id="signedMessage" 
                                        value={signedMessage} 
                                        onChange={handleSignedMessageChange} 
                                        placeholder="Paste the generated signature here"
                                        disabled={isLoading}
                                    />
                                </div>

                                <button 
                                    onClick={handleSignedMessageSubmit} 
                                    className="submit-icon"
                                    disabled={isLoading || !signedMessage.trim()}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Signature'} {!isLoading && <FaArrowRight />}
                                </button>
                                
                                <button 
                                    className="help-button"
                                    onClick={() => setShowInstructions(!showInstructions)}
                                >
                                    {showInstructions ? 'Hide Instructions' : 'How to sign the message'}
                                </button>
                                
                                <div className={`signing-instructions ${showInstructions ? 'show' : ''}`}>
                                    <h3>Signing Instructions</h3>
                                    <ol>
                                        <li>
                                            <strong>Open Evrmore Core</strong>
                                            <p>Launch your Evrmore Core wallet application</p>
                                        </li>
                                        <li>
                                            <strong>Access Console</strong>
                                            <p>Navigate to: Tools → Debug Console</p>
                                        </li>
                                        <li>
                                            <strong>Unlock Wallet</strong>
                                            <p>Enter this command:</p>
                                            <div 
                                                className="command"
                                                onClick={() => copyToClipboard(`walletpassphrase "your-passphrase" 30`)}
                                            >
                                                walletpassphrase "your-passphrase" 30
                                            </div>
                                        </li>
                                        <li>
                                            <strong>Sign Message</strong>
                                            <p>Copy and enter this command:</p>
                                            <div 
                                                className="command"
                                                onClick={() => copyToClipboard(`signmessage ${address} "${challenge}"`)}
                                            >
                                                signmessage {address} "{challenge}"
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        )}
                        
                        {step === 3 && (
                            <div className="step-form">
                                <h2>Successfully Authenticated</h2>
                                <p>You are now signed in to Manticore Exchange.</p>
                                <p className="session-info">Your session will remain active until you sign out or close your browser.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SignIn;
