// NetworkStats.tsx

import React, { useState, useEffect } from "react";
import "../styles/NetworkStats.css";
import api from "../utility/api";

// Define the shape of your stats object using an interface
interface Stats {
  assets: number;
  main_assets_count?: number;
  sub_assets_count?: number;
  unique_assets_count?: number;
  message_channels_count?: number;
  qualifiers_count?: number;
  sub_qualifiers_count?: number;
  restricted_assets_count?: number;
  [key: string]: unknown; // Allow for other dynamic properties, if necessary
}

interface APIStats {
  data: Stats
}

const NetworkStats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({assets:0});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<APIStats>('/getnetworkstats');
        // Use optional chaining to safely access data
        setStats(response.data);  // Set a fallback empty object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to fetch stats:", err);
        setError(err);
        // You may want to set some default state or handle the error appropriately
      }
    };

    fetchStats();
  }, []);

  if (error) {
    // Handle the error state in your UI
    return <div>Error loading network statistics: {error.message}</div>;
  }

  // Render the stats in a neat list
  return (
    <div className="network-stats">
      <ul>
        <li>Assets Minted: {stats.assets}</li>
        <li>Main Assets: {stats.main_assets_count}</li>
        <li>Sub Assets: {stats.sub_assets_count}</li>
        <li>Unique Assets: {stats.unique_assets_count}</li>
        <li>Message Assets: {stats.unique_assets_count}</li>
        <li>Qualifier Assets: {stats.unique_assets_count}</li>
        <li>Sub Qualifier Assets: {stats.sub_qualifiers_count}</li>
        <li>Restricted Assets: {stats.restricted_assets_count}</li>
      </ul>
      <ul>
        <li>Assets Minted: {stats.assets}</li>
        <li>Main Assets: {stats.main_assets_count}</li>
        <li>Sub Assets: {stats.sub_assets_count}</li>
        <li>Unique Assets: {stats.unique_assets_count}</li>
        <li>Message Assets: {stats.unique_assets_count}</li>
        <li>Qualifier Assets: {stats.unique_assets_count}</li>
        <li>Sub Qualifier Assets: {stats.sub_qualifiers_count}</li>
        <li>Restricted Assets: {stats.restricted_assets_count}</li>
      </ul>
    </div>
  );
};

export default NetworkStats;
