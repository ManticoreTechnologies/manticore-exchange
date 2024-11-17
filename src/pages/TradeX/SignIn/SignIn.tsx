import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket'; // Adjust the path as necessary
import './SignIn.css'; // Import CSS for styling and animations
import Cookies from 'js-cookie'; // Import Cookies for session management
import { FaArrowRight } from 'react-icons/fa';

const SignIn: React.FC = () => {
    //@ts-ignore
    const [balances, setBalances] = useState<any[]>([]);
    const [address, setAddress] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    const [challenge, setChallenge] = useState('');
    const [step, setStep] = useState(1); // Track the current step
    const [sessionRestored, setSessionRestored] = useState(false); // New state to track session restoration
    const [remainingTime, setRemainingTime] = useState<number | null>(null); // New state for remaining time

    const { message, sendMessage } = useWebSocket('wss://ws.manticore.exchange');

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
                            <input type="text" id="address" value={address} onChange={handleAddressChange} />
                            <button type="submit" className="submit-icon"> Next <FaArrowRight /></button>
                        </form>
                    )}
                    {step === 2 && (
                        <div className="step-form">
                            <h2>Step 2: Sign the Challenge</h2>
                            <p>Challenge: {challenge}</p>
                            <p>Sign this challenge with your wallet and paste the signature below.</p>
                            <label htmlFor="signedMessage">Signed Message:</label>
                            <input type="text" id="signedMessage" value={signedMessage} onChange={handleSignedMessageChange} />
                            <button onClick={handleSignedMessageSubmit}> Sign In <FaArrowRight /></button>
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
