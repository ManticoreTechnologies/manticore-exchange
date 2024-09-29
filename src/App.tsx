// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import "./App.css";
import BlogPage from "./Blog/Blog";
import Footer from "./Footer/Footer";
import Roadmap from "./Roadmap/Roadmap";
import Explorer from "./Explorer/Explorer";
import Trading from "./Trading/Trading";
import { ThemeProvider } from "./context/ThemeContext";
import WelcomeToEvrmore from "./Blog/posts/WelcomeToEvrmore";
import EvrmoreSocialCommerce from "./Blog/posts/EvmoreSocialCommerce";
import WalletBasedAuthEvrmore from "./Blog/posts/WalletBasedAuthEvrmore";
import Faucet from "./Faucet/Faucet";
import Home from "./Home/Home";
import AssetDetails from "./components/assets/AssetDetails";
import IPFSUploader from "./Ipfs/Ipfs";

const App: React.FC = () => {

  return (
    <div className="App">
      <Navbar />
      <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Explorer />} />
      <Route path="/trade" element={<Trading />} />
      <Route path="/faucet" element={<Faucet />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/WelcomeToEvrmore" element={<WelcomeToEvrmore />} />
      <Route path="/blog/EvrmoreSocialCommerce" element={<EvrmoreSocialCommerce />} />
      <Route path="/blog/WalletBasedAuthEvrmore" element={<WalletBasedAuthEvrmore />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/asset/:name" element={<AssetDetails />}/>
      <Route path="/ipfs" element={<IPFSUploader/>}/>
      </Routes>
      <Footer />
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <ThemeProvider>
    <Router>
      <App />
    </Router>
  </ThemeProvider>
);

export default AppWrapper;
