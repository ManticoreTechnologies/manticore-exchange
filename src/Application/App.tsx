import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import './styles/themes.css';
import CreateListingPage from './pages/Trade/CreateListingPage/CreateListingPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App; 