import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AssetCard from "../../components/assets/AssetCard";
import FilterSortBar from "../../components/assets/FilterSortBar";
import "../../styles/AssetListPage.css";
import api from "../../utility/api";
import Pagination from "../../components/Pagination";
import { FaArrowRight } from "react-icons/fa";

interface Asset {
  name: string;
  has_ipfs: number;
  amount: number;
  reissuable: number;
  units: number;
  ipfs_hash?: string;
  listed?: boolean; // Added listed property to match filtering options
  date?: any; // Added date property to match sorting options,
  type: any;
}

interface Meta {
  total_pages: number;
  total_items: number;
}

interface ApiResponse {
  data: { [key: string]: Asset };
  meta: Meta;
}

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const ipfsParam = searchParams.get("showIPFSOnly") === "true";
  const queryParam = searchParams.get("query") || "";
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const [assetsPerPage] = useState<number>(32);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filter, setFilter] = useState<string>(queryParam);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showIPFSOnly, setShowIPFSOnly] = useState<boolean>(ipfsParam);
  const [query, setQuery] = useState<string>(queryParam);
  const [filters, setFilters] = useState({ type: "", status: "", ipfs: "" });
  const [sort, setSort] = useState<string>("name_asc");

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<ApiResponse>(
        `/searchassets?query=${encodeURIComponent(
          filter
        )}&page=${currentPage}&per_page=${assetsPerPage}&ipfs_only=${showIPFSOnly}`
      );
      setAssets(response.data ? Object.values(response.data) : []);
      setTotalPages(response.meta ? response.meta.total_pages : 0);
      setTotalItems(response.meta ? response.meta.total_items : 0);
    } catch (error) {
      setError("Failed to load assets");
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, currentPage, assetsPerPage, showIPFSOnly]);

  useEffect(() => {
    setQuery(filter);
    fetchAssets();
  }, [fetchAssets, setQuery, filter]);

  useEffect(() => {
    setSearchParams({
      query: query,
      page: currentPage.toString(),
      showIPFSOnly: showIPFSOnly.toString(),
    });
  }, [query, currentPage, showIPFSOnly, setSearchParams]);

  const toggleIPFSFilter = () => {
    setShowIPFSOnly(!showIPFSOnly);
    setCurrentPage(1);
  };

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    setQuery(filter);
    setSearchParams({
      query: filter,
      page: currentPage.toString(),
      showIPFSOnly: showIPFSOnly.toString(),
    });
    fetchAssets();
  }, [fetchAssets, filter, setSearchParams, currentPage, showIPFSOnly]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleExploreClick = () => {
    navigate("/explore");
  };

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
    <div className="asset-list-container">
      <div className="header">
        <button className="explore-assets-button" onClick={handleExploreClick}>
          Explore Assets <FaArrowRight />
        </button>
      </div>
      <h1>Search Assets</h1>
      <FilterSortBar
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <div className="filter-bar">
        <input
          id="asset_filter"
          autoComplete="true"
          type="text"
          placeholder="Filter assets..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button onClick={toggleIPFSFilter} className="toggle-button">
          {showIPFSOnly ? "Show All" : "Has IPFS"}
        </button>
      </div>
      {isLoading ? (
        <div className="asset-list">{"loading..."}</div>
      ) : error ? (
        <div className="asset-list">Error: {error}</div>
      ) : (
        <>
          <Pagination
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
          <div className="asset-list asset-grid">
            {displayedAssets.map((asset, index) => (
              <AssetCard
                key={`${asset.name}_${index}`}
                asset={{
                  ...asset,
                  has_ipfs: true,
                  amount: 0,
                  reissuable: false,
                  units: 0,
                  listed: false,
                }}
                page={currentPage}
                query={filter}
                showIPFSOnly={showIPFSOnly}
              />
            ))}
          </div>
          <Pagination
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Assets;
