/* 
Manticore Technologies
(c) 2025
application.tsx */

import React from 'react';
import NavigationBar from "./components/navigation/navigation-bar/navigation-bar";
import { RouterProvider } from "react-router-dom";
import Footer from "./components/navigation/footer/footer";
import { ThemeProvider } from "./contexts/theme-context";
import { AuthProvider } from './contexts/AuthContext';
import { router } from './router';
import "./application.css";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="application">
            <NavigationBar />
            <div className="main">
                {children}
            </div>
            <Footer />
        </div>
    );
};

const Application: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </AuthProvider>
    );
};

export default Application;