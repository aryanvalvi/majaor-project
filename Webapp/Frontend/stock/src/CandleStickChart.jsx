import React from "react";
import { Chart, registerables } from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
Chart.register(...registerables);
Chart.register(CandlestickController, CandlestickElement);

const CandleStickChart = ({ data }) => {
  // Prepare the chart data
  const chartData = {
    datasets: [
      {
        label: "Stock Price",
        data: data.map((point) => ({
          x: point.date, // Date
          o: point.open, // Open price
          h: point.high, // High price
          l: point.low, // Low price
          c: point.close, // Close price
        })),
        backgroundColor: "rgba(0, 255, 0, 0.5)", // Customize colors if needed
        borderColor: "rgba(0, 128, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Candlestick Chart</h2>
      <Bar data={chartData} options={{ responsive: true }} />{" "}
      {/* Render the Bar chart */}
    </div>
  );
};

export default CandleStickChart;
