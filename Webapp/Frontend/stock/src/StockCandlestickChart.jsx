import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { CandlestickController } from "chartjs-chart-financial";

Chart.register(...registerables, CandlestickController);

const StockCandlestickChart = ({ stockSymbol, features }) => {
  const [candlestickData, setCandlestickData] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);

  // Fetch historical stock data
  const fetchHistoricalData = async (symbol) => {
    try {
      const response = await fetch(
        `http://localhost:5000/historicall/${symbol}`
      );
      const data = await response.json();
      setCandlestickData(data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  // Fetch predicted stock price
  const fetchPredictedPrice = async () => {
    try {
      const response = await fetch(`http://localhost:5000/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features), // Use features from props
      });
      const data = await response.json();
      setPredictedPrice(data.predictedPrice);
    } catch (error) {
      console.error("Error fetching predicted price:", error);
    }
  };

  useEffect(() => {
    fetchHistoricalData(stockSymbol); // Fetch historical data for the provided stock symbol
    fetchPredictedPrice(); // Fetch predicted price based on features
  }, [stockSymbol, features]); // Depend on stockSymbol and features

  useEffect(() => {
    if (candlestickData.length && predictedPrice !== null) {
      const ctx = document.getElementById("candlestickChart").getContext("2d");
      const chart = new Chart(ctx, {
        type: "candlestick",
        data: {
          datasets: [
            {
              label: `${stockSymbol} Candlestick`,
              data: candlestickData.map((item) => ({
                t: item.timestamp, // x-axis (time)
                o: item.open, // open price
                h: item.high, // high price
                l: item.low, // low price
                c: item.close, // close price
              })),
            },
            {
              label: "Predicted Price",
              type: "line",
              data: candlestickData.map((item, index) => ({
                x: item.timestamp,
                y: index === candlestickData.length - 1 ? predictedPrice : null, // Last point for prediction
              })),
              borderColor: "red",
              fill: false,
              pointRadius: 5,
              pointBackgroundColor: "red",
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });

      return () => chart.destroy();
    }
  }, [candlestickData, predictedPrice]);

  return (
    <div>
      {/* Candlestick chart */}
      <div>
        <canvas id="candlestickChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
};

export default StockCandlestickChart;
