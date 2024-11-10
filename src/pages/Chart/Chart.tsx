import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface ChartProps {
  data: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

const TradeChart: React.FC<ChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 400);
      }
    };

    const initializeChart = () => {
      if (chartContainerRef.current) {
        chartRef.current = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: {
            background: { color: 'transparent' },
            textColor: '#ff4d4d',
          },
          grid: {
            vertLines: { color: '#2B2B43' },
            horzLines: { color: '#363C4E' },
          },
        });

        lineSeriesRef.current = chartRef.current.addLineSeries({
          color: '#ff4d4d',
        });
        lineSeriesRef.current.setData(
          (data.length > 0 ? data : generateRandomData()).map(d => ({ time: d.time, value: d.close }))
        );

        window.addEventListener('resize', handleResize);
      }
    };

    initializeChart();

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, [data]);

  const generateRandomData = () => {
    const randomData = [];
    for (let i = 0; i < 10; i++) {
      const day = (i + 1).toString().padStart(2, '0');
      randomData.push({
        time: `2023-10-${day}`,
        open: Math.random() * 100,
        high: Math.random() * 100,
        low: Math.random() * 100,
        close: Math.random() * 100,
        volume: Math.random() * 1000,
      });
    }
    return randomData;
  };

  return (
    <div ref={chartContainerRef} className="chart-container">
      {/* Add any additional elements here if needed */}
    </div>
  );
};

export default TradeChart;