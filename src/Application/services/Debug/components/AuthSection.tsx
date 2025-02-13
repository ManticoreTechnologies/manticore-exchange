import React, { useState } from 'react';
import { FiLock, FiKey, FiList } from 'react-icons/fi';
import DebugSection from './DebugSection';
import TestFlow from './TestFlow';
import authService from '../../AuthService';

interface AuthSectionProps {
    address: string;
    setAddress: (address: string) => void;
    addLog: (message: string) => void;
    expandedSections: Record<string, boolean>;
    toggleSection: (section: string) => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
    address,
    setAddress,
    addLog,
    expandedSections,
    toggleSection
}) => {
    const [challengeId, setChallengeId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [signature, setSignature] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<string>('');

    const authSteps = [
        {
            name: 'Set Address',
            action: async () => {
                const testAddress = prompt('Enter your Evrmore address:');
                if (testAddress) {
                    setAddress(testAddress);
                    addLog(`Set address: ${testAddress}`);
                }
            },
            isDisabled: false
        },
        {
            name: 'Create Challenge',
            action: async () => {
                try {
                    addLog('Creating challenge...');
                    const result = await authService.createChallenge(address);
                    setChallengeId(result.challenge_id);
                    setMessage(result.message);
                    addLog(`Challenge created: ${result.challenge_id}`);
                    addLog(`Message to sign: ${result.message}`);
                } catch (error: any) {
                    addLog(`Error creating challenge: ${error.message}`);
                }
            },
            isDisabled: !address
        },
        {
            name: 'Set Signature',
            action: async () => {
                const sig = prompt('Enter the signature (sign the message using your Evrmore wallet):');
                if (sig) {
                    setSignature(sig);
                    addLog(`Set signature: ${sig}`);
                }
            },
            isDisabled: !message
        },
        {
            name: 'Verify Challenge',
            action: async () => {
                try {
                    addLog('Verifying challenge...');
                    const result = await authService.verifyChallenge({
                        challenge_id: challengeId,
                        address: address,
                        signature: signature
                    });
                    setToken(result.token);
                    addLog('Challenge verified successfully');
                    addLog(`Token received: ${result.token}`);
                } catch (error: any) {
                    addLog(`Challenge verification error: ${error.message}`);
                }
            },
            isDisabled: !signature
        }
    ];

    const verifyToken = async () => {
        try {
            addLog('Verifying token...');
            const result = await authService.verifyToken();
            setVerificationResult(JSON.stringify(result, null, 2));
            addLog(`Token verified: ${JSON.stringify(result)}`);
        } catch (error: any) {
            addLog(`Token verification error: ${error.message}`);
        }
    };

    const logout = async () => {
        try {
            addLog('Logging out...');
            await authService.logout();
            setToken(null);
            setVerificationResult('');
            setAddress('');
            setChallengeId('');
            setMessage('');
            setSignature('');
            addLog('Logout successful');
        } catch (error: any) {
            addLog(`Logout error: ${error.message}`);
        }
    };

    return (
        <>
            <DebugSection
                id="auth"
                title="Authentication"
                icon={<FiLock />}
                description="Test authentication with Evrmore node"
                isExpanded={expandedSections['auth']}
                onToggle={() => toggleSection('auth')}
            >
                <DebugSection
                    id="flow"
                    title="Authentication Flow"
                    icon={<FiKey />}
                    description="Test the complete authentication flow"
                    isSubsection
                    isExpanded={expandedSections['flow']}
                    onToggle={() => toggleSection('flow')}
                >
                    <TestFlow steps={authSteps} />
                    {challengeId && (
                        <div className="challenge-info">
                            <p>Challenge ID: {challengeId}</p>
                            <p>Message to Sign: {message}</p>
                        </div>
                    )}
                    {signature && (
                        <div className="signature-info">
                            <p>Signature: {signature}</p>
                        </div>
                    )}
                </DebugSection>

                <DebugSection
                    id="token"
                    title="Token Management"
                    icon={<FiList />}
                    isSubsection
                    isExpanded={expandedSections['token']}
                    onToggle={() => toggleSection('token')}
                >
                    {token && (
                        <div className="token-info">
                            <p>Current Token: {token}</p>
                            <div className="token-actions">
                                <button onClick={verifyToken}>Verify Token</button>
                                <button onClick={logout}>Logout</button>
                            </div>
                            {verificationResult && (
                                <div className="verification-result">
                                    <h3>Verification Result:</h3>
                                    <pre>{verificationResult}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </DebugSection>
            </DebugSection>
        </>
    );
};

export default AuthSection; 