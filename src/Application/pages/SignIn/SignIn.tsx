import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/AuthService';
import './SignIn.css';

interface ChallengeData {
    challengeId: string;
    message: string;
}

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'initial' | 'challenge' | 'signature'>('initial');
    const [address, setAddress] = useState('');
    const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
    const [signature, setSignature] = useState('');
    const [copyButtonText, setCopyButtonText] = useState('Copy Command');
    
    // Get the origin path that sent us to sign in
    const from = (location.state as any)?.from?.pathname || '/profile';

    const handleBack = () => {
        navigate(-1);
    };

    const handleGetChallenge = async () => {
        if (!address) {
            setError('Please enter your Evrmore address');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const challenge = await authService.createChallenge(address);
            setChallengeData({
                challengeId: challenge.challenge_id,
                message: challenge.message,
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
            // Navigate to the original page or profile as fallback
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to verify signature');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        // Check if navigator and clipboard API are available
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                setCopyButtonText('Copied!');
                setTimeout(() => setCopyButtonText('Copy Command'), 2000);
            } catch (err) {
                console.error('Failed to copy text:', err);
                setCopyButtonText('Failed to copy');
                setTimeout(() => setCopyButtonText('Copy Command'), 2000);
            }
            return;
        }

        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                setCopyButtonText('Copied!');
            } else {
                setCopyButtonText('Failed to copy');
            }
            setTimeout(() => setCopyButtonText('Copy Command'), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            setCopyButtonText('Failed to copy');
            setTimeout(() => setCopyButtonText('Copy Command'), 2000);
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
                                onClick={() => copyToClipboard(completeCommand)}
                            >
                                <span className="sign-in__copy-icon">📋</span>
                                {copyButtonText}
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
                    <button onClick={handleBack} className="sign-in__back-button">
                        ← Back
                    </button>
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