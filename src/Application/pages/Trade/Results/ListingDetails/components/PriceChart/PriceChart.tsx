import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import type { PriceData } from '../PriceHistory/types';
import './PriceChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  data: PriceData[];
  assetName?: string;
  isIndex: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, assetName, isIndex }) => {
  // Check if data is valid and has entries
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ height: '400px' }} className="no-data-container">
        <div className="no-data-message">
          <p>No price history data available</p>
          <p className="no-data-details">
            {isIndex 
              ? "This listing doesn't have any recorded sales yet."
              : `No sales data available for ${assetName || 'this asset'}.`}
          </p>
        </div>
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        label: assetName || 'Price Index',
        data: data.map(item => ({
          x: new Date(item.time),
          y: Number(item.avg_price)
        })),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceChart; 