import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import './ChartX.css';
import { useTheme } from '../../../context/ThemeContext';

interface ChartXProps {
    tickerHistory: any;
    ohlcData?: any;
}

const ChartX: React.FC<ChartXProps> = ({ tickerHistory, ohlcData }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Line' | 'Candlestick'> | null>(null);
    const { theme } = useTheme();

    const resizeChart = useCallback(() => {
        if (chartRef.current && chartContainerRef.current) {
            chartRef.current.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
        }
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            resizeChart();
        });

        if (chartContainerRef.current) {
            observer.observe(chartContainerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [resizeChart]);

    useEffect(() => {
        try {
            if (chartContainerRef.current) {
                const currentRange = chartRef.current?.timeScale().getVisibleLogicalRange();

                chartRef.current = createChart(chartContainerRef.current, {
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                    layout: { background: { color: theme === 'light' ? '#0a0a0a' : '#ffffff' }, textColor: '#ffffff' },
                    grid: { vertLines: { color: 'transparent' }, horzLines: { color: 'transparent' } },
                });

                if (ohlcData && ohlcData.length > 0) {
                    seriesRef.current = chartRef.current.addCandlestickSeries();
                    seriesRef.current.setData(
                        ohlcData.map((candle: any) => ({
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
                        tickerHistory.map((ticker: any) => ({
                            time: new Date(ticker.time).getTime() / 1000,
                            value: ticker.price,
                        }))
                    );
                }

                if (currentRange) {
                    chartRef.current.timeScale().setVisibleLogicalRange(currentRange);
                }

                window.addEventListener('resize', resizeChart);
                resizeChart();
            }
        } catch (error) {
            console.error('Error initializing chart:', error);
        }

        return () => {
            chartRef.current?.remove();
            window.removeEventListener('resize', resizeChart);
        };
    }, [tickerHistory, ohlcData, theme, resizeChart]);

    return <div ref={chartContainerRef} className="chart-container" style={{ height: '100%', width: '100%' }}></div>;
};

export default ChartX;
