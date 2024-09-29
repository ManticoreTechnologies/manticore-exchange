import React, { useState, useEffect, useCallback } from "react";
import RandomAssetCard from "../____components/assets/RandomAssetCard";
import "../styles/ExplorePage.css";
import api from "../utility/api";
import { FaRotate } from "react-icons/fa6";

interface ApiResponse {
  data: Asset[];
}

export interface Asset {
  name: string;
  amount: number;
  has_ipfs: number;
  reissuable: number;
  units: number;
  ipfs_hash?: string;
  type: any;
  date: any;
  listed: any;
}

const ExplorePage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const fetchAssets = useCallback(async (reset = false) => {
    if (reset) {
      setAssets([]); // Clear existing assets
      setPage(1); // Reset page to 1
    }
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse>(
        `/get-random-assets?page=${reset ? 1 : page}`
      );
      if (response.data && response.data) {
        const assetList = Object.values<Asset>(response.data);
        if (assetList.length > 0) {
          setAssets((prevAssets) =>
            reset ? assetList : [...prevAssets, ...assetList]
          );
        } else if (page === 1) {
          setError("No assets found.");
        }
      }
    } catch (error) {
      setError("Unable to load assets. Please try again later.");
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 200) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }

    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleRefresh = () => {
    fetchAssets(true); // Pass `true` to reset the state
  };

  const displayedAssets = assets;

  
  return (
    <div className="explore-page">
      <h1>Explore Random Assets</h1>
      <button className="refresh-button" onClick={handleRefresh}>
        Refresh &nbsp; <FaRotate />
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="asset-list asset-grid">
        {displayedAssets.map((asset) => (
          <RandomAssetCard key={asset.name} asset={asset} />
        ))}
      </div>
      {loading && <div className="loading-spinner"></div>}
      {showBackToTop && (
        <button
          className="back-to-top-button"
          onClick={() => window.scrollTo(0, 0)}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Back to Top
        </button>
      )}
    </div>
  );
};

export default ExplorePage;
