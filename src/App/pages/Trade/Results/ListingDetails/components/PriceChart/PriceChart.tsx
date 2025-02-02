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
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { formatEvrAmount } from '@/utils/formatting';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceData {
  timestamp: string;
  price: string;
}

interface PriceChartProps {
  data: PriceData[];
  assetName?: string;
  isIndex?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, assetName, isIndex = false }) => {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: isIndex ? 'Listing Index' : `${assetName} Price`,
        data: data.map(d => parseFloat(d.price)),
        borderColor: isIndex ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
        backgroundColor: isIndex ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: isIndex ? 'Listing Price Index' : `${assetName} Price History`,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Price: ${formatEvrAmount(context.raw.toString())} EVR`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'timeseries' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d, yyyy'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (EVR)'
        },
        ticks: {
          callback: (value: number) => formatEvrAmount(value.toString())
        }
      }
    }
  };

  return (
    <div className="price-chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceChart; 