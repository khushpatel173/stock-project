import { useEffect, useRef } from "react";
import {
    createChart,
    ColorType,
    CandlestickSeries
} from "lightweight-charts";

interface Props {
    historyData: {
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
    }[];
}

function StockChart({ historyData , liveCandle }: Props) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const seriesRef = useRef<any>(null);

    useEffect(() => {

        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,

            layout: {
                background: {
                    type: ColorType.Solid,
                    color: "#0f172a",
                },
                textColor: "#ffffff",
            },

            grid: {
                vertLines: {
                    color: "#1e293b",
                },
                horzLines: {
                    color: "#1e293b",
                },
            },

            timeScale: {
                timeVisible: true,
            },
        });

        const candleSeries = chart.addSeries(CandlestickSeries);

        candleSeries.setData(historyData);
            chartRef.current = chart;
        seriesRef.current = candleSeries;
        return () => {
            chart.remove();
        };

    }, [historyData]);


    // live updates

    useEffect(() => {

        if (!liveCandle) return;

        if (!seriesRef.current) return;

        seriesRef.current.update(liveCandle);

    }, [liveCandle]);

    return (
        <div
            ref={chartContainerRef}
            style={{
                width: "100%",
                height: "500px",
            }}
        />
    );
}

export default StockChart;