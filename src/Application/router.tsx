import React from 'react';
import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Profile from './pages/Profile/Profile';
import Trading from './pages/Trade/Trading';
import CreateListingPage from './pages/Trade/CreateListingPage/CreateListingPage';
import ListingDetails from './pages/Trade/Results/ListingDetails/ListingDetails';
import ManageListingPage from './pages/Trade/ManageListingPage/ManageListingPage';
import { PrivateRoute } from './components/PrivateRoute';
import Home from './pages/home/home';
import Search from './pages/Search/Search';
import Faucet from './pages/Faucet/Faucet';
import Blog from './pages/Blog/Blog';
import Roadmap from './pages/Roadmap/Roadmap';
import Ipfs from './pages/Ipfs/Ipfs';
import EVRPage from './pages/InfoChart/EVRPage';
import Cart from './pages/Trade/Cart/Cart';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Chat from './pages/Chat/Chat';
import Launch from './pages/Launch/Launch';
import NavigationBar from './components/navigation/navigation-bar/navigation-bar';
import Footer from './components/navigation/footer/footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Bridge from './pages/Bridge/Bridge';
import TradingServiceDebug from './services/Debug/TradingServiceDebug';

const RootLayout = () => {
    return (
        <div className="application">
            <NavigationBar />
            <div className="main">
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </div>
            <Footer />
        </div>
    );
};

const NotFound = () => {
    return (
        <div className="error-container">
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <button onClick={() => window.location.href = '/trade'} className="back-button">
                Back to Trading
            </button>
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'signin',
                element: <SignIn />
            },
            {
                path: 'search',
                element: <Search />
            },
            {
                path: 'trade',
                element: <Trading />
            },
            {
                path: 'trade/create',
                element: (
                    <PrivateRoute>
                        <ErrorBoundary>
                            <CreateListingPage />
                        </ErrorBoundary>
                    </PrivateRoute>
                )
            },
            {
                path: 'trade/listings/by-id/:id',
                element: <ListingDetails />
            },
            {
                path: 'trade/listings/manage/:id',
                element: (
                    <PrivateRoute>
                        <ErrorBoundary>
                            <ManageListingPage />
                        </ErrorBoundary>
                    </PrivateRoute>
                )
            },
            {
                path: 'launch',
                element: (
                    <PrivateRoute>
                        <Launch />
                    </PrivateRoute>
                )
            },
            {
                path: 'faucet',
                element: <Faucet />
            },
            {
                path: 'blog/*',
                element: <Blog />
            },
            {
                path: 'roadmap',
                element: <Roadmap />
            },
            {
                path: 'ipfs',
                element: <Ipfs />
            },
            {
                path: 'chart',
                element: <EVRPage />
            },
            {
                path: 'profile',
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                )
            },
            {
                path: 'about',
                element: <About />
            },
            {
                path: 'contact',
                element: <Contact />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'chat',
                element: (
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                )
            },
            {
                path: 'bridge',
                element: <Bridge />
            },
            {
                path: 'debug',
                element: <TradingServiceDebug />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]); 