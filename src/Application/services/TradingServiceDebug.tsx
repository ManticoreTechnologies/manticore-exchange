import React, { useState, useEffect } from 'react';
import authService from './AuthService';
import tradingService from './TradingService';
import { FiChevronDown, FiChevronUp, FiLock, FiKey, FiList, FiTerminal, FiPackage, FiDollarSign, FiTrendingUp, FiSearch } from 'react-icons/fi';
import './TradingServiceDebug.css';

interface TestFlow {
    name: string;
    description: string;
    isExpanded: boolean;
    steps: {
        name: string;
        action: () => Promise<void>;
        isDisabled: boolean;
    }[];
}

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
    description?: string;
    isSubsection?: boolean;
}

const TradingServiceDebug: React.FC = () => {
    const [address, setAddress] = useState<string>('');
    const [challengeId, setChallengeId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [signature, setSignature] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);
    const [mainSectionExpanded, setMainSectionExpanded] = useState<boolean>(true);
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

    const sections: Section[] = [
        { id: 'auth', title: 'Authentication', icon: <FiLock />, description: 'Test authentication with Evrmore node' },
        { id: 'flow', title: 'Authentication Flow', icon: <FiKey />, description: 'Test the complete authentication flow', isSubsection: true },
        { id: 'token', title: 'Token Management', icon: <FiList />, isSubsection: true },
        { id: 'logs', title: 'Debug Logs', icon: <FiTerminal />, isSubsection: true },
        { id: 'listings', title: 'Listings', icon: <FiPackage />, description: 'Test listing endpoints and operations' },
        { id: 'listing-search', title: 'Search & Discovery', icon: <FiSearch />, description: 'Test listing search and discovery endpoints', isSubsection: true },
        { id: 'listing-management', title: 'Listing Management', icon: <FiDollarSign />, description: 'Test listing creation and management', isSubsection: true },
        { id: 'listing-analytics', title: 'Analytics', icon: <FiTrendingUp />, description: 'Test listing analytics and history', isSubsection: true },
        { id: 'featured-listings', title: 'Featured Listings', icon: <FiList />, description: 'Test featured listing operations', isSubsection: true }
    ];

    useEffect(() => {
        // Check if already authenticated
        const storedToken = authService.getToken();
        if (storedToken) {
            setToken(storedToken);
            addLog('Found existing auth token');
            verifyExistingToken();
        }
    }, []);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
    };

    const testFlows: TestFlow[] = [
        {
            name: 'Authentication Flow',
            description: 'Test the complete authentication flow with Evrmore node',
            isExpanded: true,
            steps: [
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
                    action: createChallenge,
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
                    action: verifyChallenge,
                    isDisabled: !signature
                }
            ]
        }
    ];

    async function createChallenge() {
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
    }

    async function verifyChallenge() {
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
    }

    async function verifyExistingToken() {
        try {
            addLog('Verifying token...');
            const result = await authService.verifyToken();
            setVerificationResult(JSON.stringify(result, null, 2));
            addLog(`Token verified: ${JSON.stringify(result)}`);
        } catch (error: any) {
            addLog(`Token verification error: ${error.message}`);
        }
    }

    async function logout() {
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
    }

    const clearLogs = () => {
        setLogs([]);
    };

    const toggleMainSection = () => {
        setMainSectionExpanded(prev => !prev);
    };

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const renderSectionContent = (sectionId: string) => {
        switch (sectionId) {
            case 'flow':
                return (
                    <div className="section-content">
                        <div className="test-flow-steps">
                            {testFlows[0].steps.map((step, index) => (
                                <div key={step.name} className="test-flow-step">
                                    <div className="step-number">{index + 1}</div>
                                    <button 
                                        onClick={() => step.action()}
                                        disabled={step.isDisabled}
                                    >
                                        {step.name}
                                    </button>
                                </div>
                            ))}
                        </div>

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
                    </div>
                );
            case 'token':
                return token && (
                    <div className="section-content">
                        <div className="token-info">
                            <p>Current Token: {token}</p>
                            <div className="token-actions">
                                <button onClick={verifyExistingToken}>Verify Token</button>
                                <button onClick={logout}>Logout</button>
                            </div>
                        </div>
                        {verificationResult && (
                            <div className="verification-result">
                                <h3>Verification Result:</h3>
                                <pre>{verificationResult}</pre>
                            </div>
                        )}
                    </div>
                );
            case 'logs':
                return (
                    <div className="section-content">
                        <div className="logs-header">
                            <button onClick={clearLogs} className="clear-logs">Clear Logs</button>
                        </div>
                        <div className="logs">
                            {logs.map((log, index) => (
                                <div key={index} className="log-entry">{log}</div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Listing Management State
    const [currentListing, setCurrentListing] = useState<string>('');
    const [searchParams, setSearchParams] = useState({
        search: '',
        seller_address: '',
        asset_name: '',
        min_price: '',
        max_price: '',
        tags: [] as string[]
    });
    const [listingResults, setListingResults] = useState<any>(null);
    const [analyticsResults, setAnalyticsResults] = useState<any>(null);
    const [featuredPlans, setFeaturedPlans] = useState<any>(null);

    const listingTestFlows = {
        search: [
            {
                name: 'Basic Search',
                action: async () => {
                    addLog('Performing basic listing search...');
                    const results = await tradingService.searchListings({
                        search: searchParams.search,
                        limit: 10
                    });
                    setListingResults(results);
                    addLog(`Found ${results.total_count} listings`);
                }
            },
            {
                name: 'Get Featured Listings',
                action: async () => {
                    addLog('Fetching featured listings...');
                    const results = await tradingService.getFeaturedListings();
                    setListingResults(results);
                    addLog(`Found ${results.total_count} featured listings`);
                }
            },
            {
                name: 'Get Trending Listings',
                action: async () => {
                    addLog('Fetching trending listings...');
                    const results = await tradingService.getTrendingListings('24h');
                    setListingResults(results);
                    addLog(`Found ${results.total_count} trending listings`);
                }
            },
            {
                name: 'Get New Listings',
                action: async () => {
                    addLog('Fetching new listings...');
                    const results = await tradingService.getNewListings();
                    setListingResults(results);
                    addLog(`Found ${results.total_count} new listings`);
                }
            }
        ],
        management: [
            {
                name: 'Create Listing',
                action: async () => {
                    addLog('Creating new listing...');
                    const listing = await tradingService.createListing({
                        seller_address: address,
                        name: 'Test Listing',
                        description: 'Test listing created from debug page',
                        prices: [{ asset_name: 'EVR', price_evr: '100' }],
                        tags: ['test', 'debug']
                    });
                    setCurrentListing(listing.id);
                    addLog(`Created listing with ID: ${listing.id}`);
                }
            },
            {
                name: 'Update Listing',
                action: async () => {
                    if (!currentListing) {
                        addLog('No listing selected. Create or select a listing first.');
                        return;
                    }
                    addLog(`Updating listing ${currentListing}...`);
                    const listing = await tradingService.updateListing(currentListing, {
                        name: 'Updated Test Listing',
                        description: 'Updated from debug page'
                    });
                    addLog(`Updated listing ${listing.id}`);
                }
            },
            {
                name: 'Pause Listing',
                action: async () => {
                    if (!currentListing) {
                        addLog('No listing selected. Create or select a listing first.');
                        return;
                    }
                    addLog(`Pausing listing ${currentListing}...`);
                    const result = await tradingService.pauseListing(currentListing);
                    addLog(`Paused listing ${result.listing_id}`);
                }
            },
            {
                name: 'Resume Listing',
                action: async () => {
                    if (!currentListing) {
                        addLog('No listing selected. Create or select a listing first.');
                        return;
                    }
                    addLog(`Resuming listing ${currentListing}...`);
                    const result = await tradingService.resumeListing(currentListing);
                    addLog(`Resumed listing ${result.listing_id}`);
                }
            }
        ],
        analytics: [
            {
                name: 'Get Analytics',
                action: async () => {
                    if (!currentListing) {
                        addLog('No listing selected. Create or select a listing first.');
                        return;
                    }
                    addLog(`Fetching analytics for listing ${currentListing}...`);
                    const analytics = await tradingService.getListingAnalytics(currentListing);
                    setAnalyticsResults(analytics);
                    addLog('Analytics fetched successfully');
                }
            },
            {
                name: 'Get Price History',
                action: async () => {
                    if (!currentListing) {
                        addLog('No listing selected. Create or select a listing first.');
                        return;
                    }
                    addLog(`Fetching price history for listing ${currentListing}...`);
                    const history = await tradingService.getListingPriceHistory(currentListing, 'EVR');
                    setAnalyticsResults(history);
                    addLog('Price history fetched successfully');
                }
            },
            {
                name: 'Get Asset History',
                action: async () => {
                    if (!currentListing) {
                        addLog('No listing selected. Create or select a listing first.');
                        return;
                    }
                    addLog(`Fetching asset history for listing ${currentListing}...`);
                    const history = await tradingService.getListingAssetHistory(currentListing, 'EVR');
                    setAnalyticsResults(history);
                    addLog('Asset history fetched successfully');
                }
            }
        ],
        featured: [
            {
                name: 'Get Featured Plans',
                action: async () => {
                    addLog('Fetching featured listing plans...');
                    const plans = await tradingService.getFeaturedPlans();
                    setFeaturedPlans(plans);
                    addLog('Featured plans fetched successfully');
                }
            },
            {
                name: 'Create Featured Payment',
                action: async () => {
                    if (!currentListing) {
                        addLog('No listing selected. Create or select a listing first.');
                        return;
                    }
                    addLog(`Creating featured payment for listing ${currentListing}...`);
                    const payment = await tradingService.createFeaturedPayment(currentListing, 'basic');
                    addLog(`Created featured payment: ${payment.id}`);
                }
            },
            {
                name: 'List Featured Payments',
                action: async () => {
                    addLog('Fetching featured payments...');
                    const payments = await tradingService.listFeaturedPayments();
                    setFeaturedPlans(payments);
                    addLog(`Found ${payments.length} featured payments`);
                }
            }
        ]
    };

    const renderListingSection = (sectionId: string) => {
        switch (sectionId) {
            case 'listing-search':
                return (
                    <div className="section-content">
                        <div className="search-params">
                            <input
                                type="text"
                                placeholder="Search term"
                                value={searchParams.search}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                            />
                            <input
                                type="text"
                                placeholder="Seller address"
                                value={searchParams.seller_address}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, seller_address: e.target.value }))}
                            />
                            <input
                                type="text"
                                placeholder="Asset name"
                                value={searchParams.asset_name}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, asset_name: e.target.value }))}
                            />
                        </div>
                        <div className="test-flow-steps">
                            {listingTestFlows.search.map((step, index) => (
                                <div key={step.name} className="test-flow-step">
                                    <div className="step-number">{index + 1}</div>
                                    <button onClick={step.action}>{step.name}</button>
                                </div>
                            ))}
                        </div>
                        {listingResults && (
                            <div className="results-display">
                                <h3>Search Results</h3>
                                <pre>{JSON.stringify(listingResults, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                );

            case 'listing-management':
                return (
                    <div className="section-content">
                        <div className="current-listing">
                            <p>Current Listing ID: {currentListing || 'None selected'}</p>
                        </div>
                        <div className="test-flow-steps">
                            {listingTestFlows.management.map((step, index) => (
                                <div key={step.name} className="test-flow-step">
                                    <div className="step-number">{index + 1}</div>
                                    <button onClick={step.action}>{step.name}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'listing-analytics':
                return (
                    <div className="section-content">
                        <div className="current-listing">
                            <p>Current Listing ID: {currentListing || 'None selected'}</p>
                        </div>
                        <div className="test-flow-steps">
                            {listingTestFlows.analytics.map((step, index) => (
                                <div key={step.name} className="test-flow-step">
                                    <div className="step-number">{index + 1}</div>
                                    <button onClick={step.action}>{step.name}</button>
                                </div>
                            ))}
                        </div>
                        {analyticsResults && (
                            <div className="results-display">
                                <h3>Analytics Results</h3>
                                <pre>{JSON.stringify(analyticsResults, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                );

            case 'featured-listings':
                return (
                    <div className="section-content">
                        <div className="current-listing">
                            <p>Current Listing ID: {currentListing || 'None selected'}</p>
                        </div>
                        <div className="test-flow-steps">
                            {listingTestFlows.featured.map((step, index) => (
                                <div key={step.name} className="test-flow-step">
                                    <div className="step-number">{index + 1}</div>
                                    <button onClick={step.action}>{step.name}</button>
                                </div>
                            ))}
                        </div>
                        {featuredPlans && (
                            <div className="results-display">
                                <h3>Featured Plans/Payments</h3>
                                <pre>{JSON.stringify(featuredPlans, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="trading-service-debug">
            <h1>Trading Service Debug</h1>
            
            <div className="main-section">
                <div 
                    className="main-section-header"
                    onClick={() => setMainSectionExpanded(prev => !prev)}
                >
                    <span className="header-icon"><FiLock /></span>
                    <h2>Debug Interface</h2>
                    {mainSectionExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {mainSectionExpanded && (
                    <div className="main-section-content">
                        {address && (
                            <div className="address-display">
                                Current Address: {address}
                            </div>
                        )}

                        <div className="subsections-container">
                            {sections.map(section => (
                                <div 
                                    key={section.id}
                                    className={`debug-section ${section.isSubsection ? 'subsection' : ''}`}
                                >
                                    <div 
                                        className="section-header"
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <span className="header-icon">{section.icon}</span>
                                        <h2>{section.title}</h2>
                                        {section.description && (
                                            <div className="section-description">{section.description}</div>
                                        )}
                                        {expandedSections[section.id] ? <FiChevronUp /> : <FiChevronDown />}
                                    </div>
                                    {expandedSections[section.id] && (
                                        section.id === 'flow' ? renderSectionContent('flow') :
                                        section.id === 'token' ? renderSectionContent('token') :
                                        section.id === 'logs' ? renderSectionContent('logs') :
                                        renderListingSection(section.id)
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradingServiceDebug;
