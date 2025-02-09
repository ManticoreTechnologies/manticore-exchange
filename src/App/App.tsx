// src/App.tsx

/* Import the routes and components */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Static/Navbar/Navbar";
import BlogPage from "./pages/Blog/Blog";
import Footer from "../Application/components/navigation/footer/footer";
import Roadmap from "./pages/Roadmap/Roadmap";
import Trading from "./pages/Trade/Trading";
import { ThemeProvider } from "@/Application/contexts/theme-context";
import WelcomeToEvrmore from "./pages/Blog/posts/WelcomeToEvrmore";
import EvrmoreSocialCommerce from "./pages/Blog/posts/EvrmoreSocialCommerce";
import WalletBasedAuthEvrmore from "./pages/Blog/posts/WalletBasedAuthEvrmore";
import Faucet from "./pages/Faucet/Faucet";
import IPFSUploader from "./pages/Ipfs/Ipfs";
import EVRPage from "./pages/InfoChart/EVRPage";
import NotFoundPage from "./pages/NotFound/NotFound";
import Chart from "./pages/Chart/Chart";
import "./App.css";
import AssetDetails from "./pages/Asset/Asset";
import TradeX from "./pages/TradeX/TradeX";
import SignIn from "./pages/TradeX/SignIn/SignIn";
import Wallet from "./pages/TradeX/Wallet/Wallet";
import Markets from "./pages/TradeX/Markets/Markets";
import Market from "./pages/TradeX/Market/Market";
import Deposit from "./pages/TradeX/Deposit/Deposit";
import Profile from "./pages/TradeX/Profile/Profile";
import ExploringEvrmoreAssets from "./pages/Blog/posts/ExploringEvrmoreAssets";
import BitcoinExplainer from "./pages/Blog/posts/BitcoinExplainer";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import Townhall from "./pages/Townhall/Townhall";
import CartPage from "./pages/Trade/Cart/CartPage";
import OrderStatus from './pages/Orders/OrderStatus';

import { MoonPayProvider } from '@moonpay/moonpay-react';

// Import the home page
import Home from "../Application/pages/home/home";
import Search from "./pages/Search/Search";
import ListingDetails from "./pages/Trade/Results/ListingDetails/ListingDetails";
import Launch from "./pages/Launch/Launch";
import Learn from "./pages/Learn/Learn";
const App: React.FC = () => {

  return (

    <div className="App">

      <Navbar />

      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trade" element={<Trading />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/WelcomeToEvrmore" element={<WelcomeToEvrmore />} />
          <Route path="/blog/EvrmoreSocialCommerce" element={<EvrmoreSocialCommerce />} />
          <Route path="/blog/WalletBasedAuthEvrmore" element={<WalletBasedAuthEvrmore />} />
          <Route path="/blog/ExploringEvrmoreAssets" element={<ExploringEvrmoreAssets />} />
          <Route path="/blog/BitcoinExplainer" element={<BitcoinExplainer />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/deposit/:asset" element={<Deposit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/asset/:name" element={<AssetDetails />} />
          <Route path="/ipfs" element={<IPFSUploader />} />
          <Route path="/chart" element={<EVRPage />} />
          <Route path="/trading-chart" element={<Chart data={[]} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="town-hall" element={<Townhall />} />
          <Route path="/orders/:orderId" element={<OrderStatus />} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/learn/*" element={<Learn />} />
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

/*  MOONPAY PROVIDER
<MoonPayProvider
            apiKey="pk_test_tS96CJBes7e7Fg8X1WcMeWQfmfVNHv"
            debug
        >
</MoonPayProvider>
*/