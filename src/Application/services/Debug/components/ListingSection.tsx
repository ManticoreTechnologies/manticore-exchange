import React, { useState } from 'react';
import { FiPackage, FiSearch, FiDollarSign, FiTrendingUp, FiList } from 'react-icons/fi';
import DebugSection from './DebugSection';
import TestFlow from './TestFlow';
import ResultsDisplay from './ResultsDisplay';
import tradingService from '../../TradingService';

interface ListingSectionProps {
    address: string;
    addLog: (message: string) => void;
    expandedSections: Record<string, boolean>;
    toggleSection: (section: string) => void;
}

const ListingSection: React.FC<ListingSectionProps> = ({
    address,
    addLog,
    expandedSections,
    toggleSection
}) => {
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

    const searchSteps = [
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
        }
    ];

    const managementSteps = [
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
        }
    ];

    const analyticsSteps = [
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
        }
    ];

    const featuredSteps = [
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
        }
    ];

    return (
        <DebugSection
            id="listings"
            title="Listings"
            icon={<FiPackage />}
            description="Test listing endpoints and operations"
            isExpanded={expandedSections['listings']}
            onToggle={() => toggleSection('listings')}
        >
            <DebugSection
                id="listing-search"
                title="Search & Discovery"
                icon={<FiSearch />}
                description="Test listing search and discovery endpoints"
                isSubsection
                isExpanded={expandedSections['listing-search']}
                onToggle={() => toggleSection('listing-search')}
            >
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
                <TestFlow steps={searchSteps} />
                <ResultsDisplay title="Search Results" data={listingResults} />
            </DebugSection>

            <DebugSection
                id="listing-management"
                title="Listing Management"
                icon={<FiDollarSign />}
                description="Test listing creation and management"
                isSubsection
                isExpanded={expandedSections['listing-management']}
                onToggle={() => toggleSection('listing-management')}
            >
                <div className="current-listing">
                    <p>Current Listing ID: {currentListing || 'None selected'}</p>
                </div>
                <TestFlow steps={managementSteps} />
            </DebugSection>

            <DebugSection
                id="listing-analytics"
                title="Analytics"
                icon={<FiTrendingUp />}
                description="Test listing analytics and history"
                isSubsection
                isExpanded={expandedSections['listing-analytics']}
                onToggle={() => toggleSection('listing-analytics')}
            >
                <div className="current-listing">
                    <p>Current Listing ID: {currentListing || 'None selected'}</p>
                </div>
                <TestFlow steps={analyticsSteps} />
                <ResultsDisplay title="Analytics Results" data={analyticsResults} />
            </DebugSection>

            <DebugSection
                id="featured-listings"
                title="Featured Listings"
                icon={<FiList />}
                description="Test featured listing operations"
                isSubsection
                isExpanded={expandedSections['featured-listings']}
                onToggle={() => toggleSection('featured-listings')}
            >
                <div className="current-listing">
                    <p>Current Listing ID: {currentListing || 'None selected'}</p>
                </div>
                <TestFlow steps={featuredSteps} />
                <ResultsDisplay title="Featured Plans/Payments" data={featuredPlans} />
            </DebugSection>
        </DebugSection>
    );
};

export default ListingSection; 