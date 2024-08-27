// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Home";
import AboutPage from "./pages/About";
import WalletAssetsListPage from "./pages/Wallets";
import LaunchPage from "./pages/LaunchPage";
import "./App.css";
import AssetDetail from "./components/assets/AssetDetails";
import BlogPage from "./pages/Blog";
import AssetNameGenerator from "./pages/assets/AssetNameGenerator";
import Footer from "./components/Footer";
import Transactions from "./pages/Transactions";
import FeaturesPage from "./pages/Features";
import ContactPage from "./pages/Contact";
import BankPage from "./pages/BankPage";
import ExplorePage from "./pages/ExplorePage";
import Roadmap from "./pages/Roadmap";
import AssetMinter from "./pages/assets/AssetMinter";
import EVRPage from "./pages/EVRPage";
import FaucetPage from "./pages/assets/FaucetPage";
import Explorer from "./pages/Explorer/Explorer";
import Trading from "./pages/Trading/Trading";
import EvrmoreBlogPost from "./pages/blogs/EvrmoreBlogPost";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/generate" element={<AssetNameGenerator />} />
        <Route path="/asset/:name" element={<AssetDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:address" element={<Transactions />} />
        <Route path="/wallet" element={<WalletAssetsListPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faucet" element={<FaucetPage />} />
        <Route path="/bank" element={<BankPage />} />
        <Route path="/discover" element={<ExplorePage />} />
        <Route path="/trade" element={<Trading />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/mint" element={<AssetMinter />} />
        <Route path="/evr" element={<EVRPage />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/blog/evrmore-intro" element={<EvrmoreBlogPost />} />
      </Routes>
      <Footer />
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;


