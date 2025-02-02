import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TransactionGraphProps {
  data: {
    timestamps: string[];
    values: number[];
  };
  assetName: string;
}

const TransactionGraph: React.FC<TransactionGraphProps> = ({ data, assetName }) => {
  const chartData = {
    labels: data.timestamps.map(ts => new Date(ts).toLocaleDateString()),
    datasets: [
      {
        label: `${assetName} Transactions`,
        data: data.values,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${assetName} Transaction History`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="transaction-graph">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TransactionGraph; 