import React from "react";
import { Line } from "react-chartjs-2";
import CandleStickChart from "./CandleStickChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register the scales and components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Chart = ({ features, prediction, historicalData }) => {
  // Ensure features is an array, fallback to empty array if not
  const featureArray = features || [];
  // Ensure historicalData is an array, fallback to empty array if not
  const historicalArray = historicalData || [];

  // Prepare the data for the line chart
  const data = {
    labels: featureArray.map((_, index) => `Feature ${index + 1}`),
    datasets: [
      {
        label: "Stock Price Prediction",
        data: [...featureArray.map(Number), prediction || 0], // Include features and prediction as numbers
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2>Features and Prediction</h2>
      <Line data={data} />
      {historicalArray.length > 0 && (
        <CandleStickChart data={historicalArray} />
      )}{" "}
      {/* Render CandlestickChart if data is available */}
    </div>
  );
};

export default Chart;
