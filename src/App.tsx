// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Static/Navbar/Navbar";
import BlogPage from "./pages/Blog/Blog";
import Footer from "./components/Static/Footer/Footer";
import Roadmap from "./pages/Roadmap/Roadmap";
import Explorer from "./pages/Search/Explorer";
import Trading from "./pages/Trade/Trading";
import { ThemeProvider } from "./context/ThemeContext";
import WelcomeToEvrmore from "./pages/Blog/posts/WelcomeToEvrmore";
import EvrmoreSocialCommerce from "./pages/Blog/posts/EvmoreSocialCommerce";
import WalletBasedAuthEvrmore from "./pages/Blog/posts/WalletBasedAuthEvrmore";
import Faucet from "./pages/Faucet/Faucet";
import Home from "./pages/Home/Home";
import AssetDetails from "./____components/assets/AssetDetails";
import IPFSUploader from "./pages/Ipfs/Ipfs";
import EVRPage from "./pages/InfoChart/EVRPage";
import NotFoundPage from "./pages/NotFound/NotFound";
import Chart from "./pages/Chart/Chart";
import "./App.css";
import TradeX from "./pages/TradeX/TradeX";
import SignIn from "./pages/TradeX/SignIn/SignIn";
import Wallet from "./pages/TradeX/Wallet/Wallet";
const App: React.FC = () => {

  return (
    <div className="App">
      <Navbar />
      <div className="main">
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
      <Route path="/tradeX" element={<TradeX />} />
      <Route path="/tradeX/signin" element={<SignIn />} />
      <Route path="/tradeX/wallet" element={<Wallet />} />
      <Route path="/asset/:name" element={<AssetDetails />}/>
      <Route path="/ipfs" element={<IPFSUploader/>}/>
      <Route path="/chart" element={<EVRPage />}/>
      <Route path="/trading-chart" element={<Chart data={[]} />}/>
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
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
