import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import './ChartX.css';
import { useTheme } from '../../../context/ThemeContext';

interface ChartXProps {
    tickerHistory: { time: string, price: number }[];
    ohlcData?: { time: string, open: number, high: number, low: number, close: number }[];
}

const ChartX: React.FC<ChartXProps> = ({ tickerHistory, ohlcData }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Line' | 'Candlestick'> | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        try {
            if (chartContainerRef.current) {
                const currentRange = chartRef.current?.timeScale().getVisibleLogicalRange();

                chartRef.current = createChart(chartContainerRef.current, {
                    width: chartContainerRef.current.clientWidth,
                    height: 550,
                    layout: { background: { color: theme === 'light' ? '#0a0a0a' : '#ffffff' }, textColor: '#ffffff' },
                    grid: { vertLines: { color: 'transparent' }, horzLines: { color: 'transparent' } },
                });

                if (ohlcData && ohlcData.length > 0) {
                    seriesRef.current = chartRef.current.addCandlestickSeries();
                    seriesRef.current.setData(
                        ohlcData.map(candle => ({
                            time: new Date(candle.timestamp).getTime() / 1000,
                            open: candle.open,
                            high: candle.high,
                            low: candle.low,
                            close: candle.close,
                        }))
                    );
                } else {
                    seriesRef.current = chartRef.current.addLineSeries({ color: '#8884d8' });
                    seriesRef.current.setData(
                        tickerHistory.map(ticker => ({
                            time: new Date(ticker.time).getTime() / 1000,
                            value: ticker.price,
                        }))
                    );
                }

                if (currentRange) {
                    chartRef.current.timeScale().setVisibleLogicalRange(currentRange);
                }
            }
        } catch (error) {
            console.error('Error initializing chart:', error);
        }

        return () => chartRef.current?.remove();
    }, [tickerHistory, ohlcData, theme]);

    return <div ref={chartContainerRef} className="chart-container"></div>;
};

export default ChartX;
