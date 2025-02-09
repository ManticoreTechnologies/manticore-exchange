/* 
Manticore Technologies
(c) 2025
application.tsx */

import React from 'react';
import NavigationBar from "./components/navigation/navigation-bar/navigation-bar";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/navigation/footer/footer";
import { ThemeProvider } from "./contexts/theme-context";
import Home from "./pages/home/home";
import Search from "./pages/Search/Search";
import Trading from "./pages/Trade/Trading";
import CreateListingPage from "./pages/Trade/CreateListingPage/CreateListingPage";
import Faucet from "./pages/Faucet/Faucet";
import Blog from "./pages/Blog/Blog";
import Roadmap from "./pages/Roadmap/Roadmap";
import Ipfs from "./pages/Ipfs/Ipfs";
import EVRPage from "./pages/InfoChart/EVRPage";
import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Trade/Cart/Cart";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Chat from "./pages/Chat/Chat";
import "./application.css";
import { AuthProvider } from './contexts/AuthContext';
import SignIn from "./pages/SignIn/SignIn";
import RouteGuard from "./components/RouteGuard/RouteGuard";

const Application: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <div className="application">
                        <NavigationBar />
                        <div className="main">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/trade" element={<Trading />} />
                                <Route 
                                    path="/trade/create" 
                                    element={
                                        <RouteGuard>
                                            <CreateListingPage />
                                        </RouteGuard>
                                    } 
                                />
                                <Route path="/faucet" element={<Faucet />} />
                                <Route path="/blog/*" element={<Blog />} /> 
                                <Route path="/roadmap" element={<Roadmap />} />
                                <Route path="/ipfs" element={<Ipfs />} />
                                <Route path="/chart" element={<EVRPage />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/cart" element={<Cart onBack={() => {}} />} />
                                <Route 
                                    path="/chat" 
                                    element={
                                        <RouteGuard>
                                            <Chat />
                                        </RouteGuard>
                                    } 
                                />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default Application;