import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import './ChartX.css';
import { useTheme } from '../../../context/ThemeContext';

interface ChartXProps {
    tickerHistory: { time: string, price: number }[];
}

const ChartX: React.FC<ChartXProps> = ({ tickerHistory }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
    const { theme } = useTheme();
    useEffect(() => {
        try {
            if (chartContainerRef.current) {
                // Save the current time range (includes both zoom and pan)
                const currentRange = chartRef.current?.timeScale().getVisibleLogicalRange();

                chartRef.current = createChart(chartContainerRef.current, {
                    width: chartContainerRef.current.clientWidth,
                    height: 550,
                    layout: { background: { color: theme === 'light' ? '#0a0a0a' : '#ffffff' }, textColor: '#ffffff' },
                    grid: { vertLines: { color: 'transparent' }, horzLines: { color: 'transparent' } },
                });

                lineSeriesRef.current = chartRef.current.addLineSeries({ color: '#8884d8' });
                lineSeriesRef.current.setData(
                    tickerHistory.map(ticker => ({
                        time: new Date(ticker.time).getTime() / 1000,
                        value: ticker.price,
                    }))
                );

                // Restore the saved time range
                if (currentRange) {
                    chartRef.current.timeScale().setVisibleLogicalRange(currentRange);
                }
            }
        } catch (error) {
            console.error('Error initializing chart:', error);
        }

        return () => chartRef.current?.remove();
    }, [tickerHistory, theme]); // Added theme to dependencies

    return <div ref={chartContainerRef} className="chart-container"></div>;
};

export default ChartX;
