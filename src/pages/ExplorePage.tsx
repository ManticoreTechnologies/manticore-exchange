import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RandomAssetCard from "../components/assets/RandomAssetCard";
import FilterSortBar from "../components/assets/FilterSortBar";
import "../styles/ExplorePage.css";
import api from "../utility/api";
import { FaArrowLeft } from "react-icons/fa";
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
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ type: "", status: "", ipfs: "" });
  const [sort, setSort] = useState<string>("name_asc");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse>(
        `/get-random-assets?page=${page}`
      );
      if (response.data && response.data) {
        const assetList = Object.values<Asset>(response.data);
        if (assetList.length > 0) {
          setAssets((prevAssets) => [...prevAssets, ...assetList]);
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

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: value }));
  };

  const handleSortChange = (sort: string) => {
    setSort(sort);
  };

  const applyFiltersAndSort = (assets: Asset[]) => {
    let filteredAssets = assets;

    if (filters.type) {
      filteredAssets = filteredAssets.filter(
        (asset) => asset.type === filters.type
      );
    }

    if (filters.status) {
      filteredAssets = filteredAssets.filter((asset) => {
        if (filters.status === "listed") return asset.listed;
        if (filters.status === "unlisted") return !asset.listed;
        if (filters.status === "reissuable") return asset.reissuable;
        if (filters.status === "non-reissuable") return !asset.reissuable;
        return true;
      });
    }

    if (filters.ipfs) {
      filteredAssets = filteredAssets.filter((asset) => {
        if (filters.ipfs === "with_ipfs") return asset.has_ipfs;
        if (filters.ipfs === "without_ipfs") return !asset.has_ipfs;
        return true;
      });
    }

    switch (sort) {
      case "name_asc":
        filteredAssets.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filteredAssets.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "amount_asc":
        filteredAssets.sort((a, b) => a.amount - b.amount);
        break;
      case "amount_desc":
        filteredAssets.sort((a, b) => b.amount - a.amount);
        break;
      case "date_newest":
        filteredAssets.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date_oldest":
        filteredAssets.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "status_listed":
        filteredAssets.sort((a, b) =>
          a.listed === b.listed ? 0 : a.listed ? -1 : 1
        );
        break;
      case "status_unlisted":
        filteredAssets.sort((a, b) =>
          a.listed === b.listed ? 0 : a.listed ? 1 : -1
        );
        break;
      default:
        break;
    }

    return filteredAssets;
  };

  const displayedAssets = applyFiltersAndSort(assets);

  return (
    <div className="explore-page">
      <div className="header">
        <button
          className="back-assets-button"
          onClick={() => navigate("/explore")}
        >
          <FaArrowLeft /> &nbsp; Back to Assets
        </button>
      </div>
      <h1>Explore Assets</h1>
      <FilterSortBar
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <button
        className="refresh-button"
        onClick={() => window.location.reload()}
      >
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
