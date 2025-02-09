import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Profile from './pages/Profile/Profile';
import Trading from './pages/Trade/Trading';
import CreateListingPage from './pages/Trade/CreateListingPage/CreateListingPage';
import { PrivateRoute } from './components/PrivateRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: 'signin',
                element: <SignIn />
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
                path: 'profile',
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                )
            }
        ]
    }
]); 