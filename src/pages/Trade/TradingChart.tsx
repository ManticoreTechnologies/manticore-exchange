// src/components/TradingChart.tsx
import React, { useEffect, useRef } from 'react';
import { createChart, ISeriesApi, BarData } from 'lightweight-charts';

interface TradingChartProps {
  data: BarData[]; // Candlestick data
}

const TradingChart: React.FC<TradingChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400, // Larger height for the chart
      layout: {
        backgroundColor: '#131722', // Dark background
        textColor: '#D9D9D9', // Light text color
      },
      grid: {
        vertLines: {
          color: '#363C4E',
        },
        horzLines: {
          color: '#363C4E',
        },
      },
      priceScale: {
        borderColor: '#485C7B',
      },
      timeScale: {
        borderColor: '#485C7B',
      },
    });

    const candlestickSeries: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries({
      upColor: '#4AFA9A',
      downColor: '#FF4976',
      borderDownColor: '#FF4976',
      borderUpColor: '#4AFA9A',
      wickDownColor: '#FF4976',
      wickUpColor: '#4AFA9A',
    });

    candlestickSeries.setData(data);

    // Clean up chart on component unmount
    return () => {
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default TradingChart;

