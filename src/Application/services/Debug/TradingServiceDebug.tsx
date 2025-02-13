import React, { useState, useEffect } from 'react';
import authService from '../AuthService';
import Sidebar from './components/Sidebar';
import AuthSection from './components/AuthSection';
import ListingSection from './components/ListingSection';
import LogsSection from './components/LogsSection';
import './styles/TradingServiceDebug.css';

const TradingServiceDebug: React.FC = () => {
    const [address, setAddress] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);
    const [currentSection, setCurrentSection] = useState<string>('auth');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'auth': true,
        'flow': true,
        'token': true,
        'logs': true,
        'listings': true,
        'listing-search': true,
        'listing-management': true,
        'listing-analytics': true,
        'featured-listings': true
    });

    useEffect(() => {
        const storedToken = authService.getToken();
        if (storedToken) {
            addLog('Found existing auth token');
            verifyExistingToken();
        }
    }, []);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const verifyExistingToken = async () => {
        try {
            addLog('Verifying existing token...');
            const result = await authService.verifyToken();
            if (result.valid) {
                setAddress(result.address);
                addLog(`Token verified for address: ${result.address}`);
            }
        } catch (error: any) {
            addLog(`Token verification error: ${error.message}`);
        }
    };

    const renderContent = () => {
        switch (currentSection) {
            case 'auth':
            case 'flow':
            case 'token':
                return (
                    <AuthSection
                        address={address}
                        setAddress={setAddress}
                        addLog={addLog}
                        expandedSections={expandedSections}
                        toggleSection={toggleSection}
                    />
                );
            case 'listings':
            case 'listing-search':
            case 'listing-management':
            case 'listing-analytics':
            case 'featured-listings':
                return (
                    <ListingSection
                        address={address}
                        addLog={addLog}
                        expandedSections={expandedSections}
                        toggleSection={toggleSection}
                    />
                );
            case 'logs':
                return (
                    <LogsSection
                        logs={logs}
                        clearLogs={clearLogs}
                        expandedSections={expandedSections}
                        toggleSection={toggleSection}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="trading-service-debug">
            <Sidebar
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
            />
            
            <div className="debug-content">
                {address && (
                    <div className="address-display">
                        Current Address: {address}
                    </div>
                )}
                <div className="content-container">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TradingServiceDebug; 