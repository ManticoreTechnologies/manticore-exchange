import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
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

const RootLayout = () => {
    return (
        <div className="application">
            <NavigationBar />
            <div className="main">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
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
                        <CreateListingPage />
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
                        <ManageListingPage />
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
                element: <Cart onBack={() => {}} />
            },
            {
                path: 'chat',
                element: (
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                )
            }
        ]
    }
]); 