import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './SignIn.css';

interface ChallengeData {
    challengeId: string;
    message: string;
    expiresAt: string;
}

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { requestChallenge, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'initial' | 'challenge' | 'signature'>('initial');
    const [address, setAddress] = useState('');
    const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
    const [signature, setSignature] = useState('');
    
    const from = (location.state as any)?.from?.pathname || '/';

    const handleGetChallenge = async () => {
        if (!address) {
            setError('Please enter your Evrmore address');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const challenge = await requestChallenge(address);
            setChallengeData({
                challengeId: challenge.challengeId,
                message: challenge.message,
                expiresAt: challenge.expiresAt
            });
            setStep('challenge');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get challenge');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitSignature = async () => {
        if (!signature || !challengeData) {
            setError('Please provide the signed message');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await login(address, signature, challengeData.challengeId);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to verify signature');
        } finally {
            setIsLoading(false);
        }
    };

    const renderInitialStep = () => (
        <>
            <h1>Connect Your Wallet</h1>
            <p className="sign-in__subtitle">Enter your Evrmore address to begin</p>
            
            <div className="sign-in__form">
                <input
                    type="text"
                    placeholder="Your Evrmore Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="sign-in__input"
                />
                
                <button 
                    className="sign-in__connect-button"
                    onClick={handleGetChallenge}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="sign-in__spinner"></span>
                            Getting Challenge...
                        </>
                    ) : (
                        'Get Challenge'
                    )}
                </button>
            </div>
        </>
    );

    const renderChallengeStep = () => {
        // Construct the complete command without the evrmore-cli prefix
        const completeCommand = challengeData 
            ? `signmessage ${address} "${challengeData.message}"`
            : '';

        return (
            <>
                <h1>Sign Message</h1>
                <p className="sign-in__subtitle">Sign this message using your Evrmore wallet</p>
                
                <div className="sign-in__challenge">
                    <div className="sign-in__command">
                        <label>Command to Run:</label>
                        <div className="sign-in__command-box">
                            <code>{completeCommand}</code>
                            <button 
                                className="sign-in__copy-button"
                                onClick={() => {
                                    navigator.clipboard.writeText(completeCommand);
                                    const button = document.querySelector('.sign-in__copy-button');
                                    if (button) {
                                        const originalText = button.textContent;
                                        button.textContent = 'Copied!';
                                        setTimeout(() => {
                                            button.textContent = originalText;
                                        }, 2000);
                                    }
                                }}
                            >
                                <span className="sign-in__copy-icon">📋</span>
                                Copy Command
                            </button>
                        </div>
                        <p className="sign-in__command-help">
                            Run this command in your Evrmore Core console
                        </p>
                    </div>

                    <div className="sign-in__signature">
                        <label>Paste Signature:</label>
                        <textarea
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            placeholder="Paste the signature here (without quotes)"
                            className="sign-in__signature-input"
                        />
                    </div>

                    <button 
                        className="sign-in__connect-button"
                        onClick={handleSubmitSignature}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="sign-in__spinner"></span>
                                Verifying...
                            </>
                        ) : (
                            'Submit Signature'
                        )}
                    </button>
                </div>

                <div className="sign-in__instructions">
                    <h3>Instructions:</h3>
                    <ol>
                        <li>Copy the command above</li>
                        <li>Open your Evrmore Core wallet</li>
                        <li>Go to Help → Debug Window → Console</li>
                        <li>Paste and run the command</li>
                        <li>Copy the signature (without quotes) and paste it above</li>
                    </ol>
                </div>
            </>
        );
    };

    return (
        <div className="sign-in">
            <div className="sign-in__container">
                <div className="sign-in__content">
                    {step === 'initial' ? renderInitialStep() : renderChallengeStep()}

                    {error && (
                        <div className="sign-in__error">
                            {error}
                        </div>
                    )}

                    <div className="sign-in__help">
                        <p>Need help signing messages?</p>
                        <a 
                            href="https://docs.manticore.exchange/wallet/signing" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="sign-in__help-link"
                        >
                            View Documentation
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn; 