import React, { useState } from "react";
import "./App.css";
import Chart from "./Chart"; // Import the Chart component

function App() {
  // State variables for features, stock symbol, prediction, historical data, error message, and loading status
  const [feature1, setFeature1] = useState("");
  const [feature2, setFeature2] = useState("");
  const [feature3, setFeature3] = useState("");
  const [feature4, setFeature4] = useState("");
  const [feature5, setFeature5] = useState("");
  const [feature6, setFeature6] = useState("");
  const [feature7, setFeature7] = useState("");
  const [feature8, setFeature8] = useState("");
  const [feature9, setFeature9] = useState("");
  const [feature10, setFeature10] = useState("");
  const [stockSymbol, setStockSymbol] = useState(""); // State for stock symbol
  const [prediction, setPrediction] = useState(null);
  const [historicalData, setHistoricalData] = useState([]); // State for historical data
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setError(""); // Reset error message
    setLoading(true); // Indicate loading state

    // Input validation to ensure all fields are filled
    if (
      !feature1 ||
      !feature2 ||
      !feature3 ||
      !feature4 ||
      !feature5 ||
      !feature6 ||
      !feature7 ||
      !feature8 ||
      !feature9 ||
      !feature10 ||
      !stockSymbol // Ensure stock symbol is provided
    ) {
      setError("Please enter all features and stock symbol.");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      // Send data to backend for prediction
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feature1: parseFloat(feature1),
          feature2: parseFloat(feature2),
          feature3: parseFloat(feature3),
          feature4: parseFloat(feature4),
          feature5: parseFloat(feature5),
          feature6: parseFloat(feature6),
          feature7: parseFloat(feature7),
          feature8: parseFloat(feature8),
          feature9: parseFloat(feature9),
          feature10: parseFloat(feature10),
        }),
      });

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setPrediction(result.predictedPrice); // Set the prediction result

      // Fetch historical data after prediction
      await fetchHistoricalData(stockSymbol); // Fetch historical data for the stock symbol
    } catch (err) {
      console.error(err);
      setError("Error getting prediction. Try again later."); // Display error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Fetch historical data based on the stock symbol
  const fetchHistoricalData = async (symbol) => {
    try {
      const response = await fetch(
        `http://localhost:5000/historical/${symbol}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }
      const data = await response.json();
      setHistoricalData(data); // Set historical data
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setError("Error fetching historical data."); // Display error message
    }
  };

  return (
    <div className="App">
      <h1>Stock Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Stock Symbol: </label>
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            placeholder="e.g., AAPL, TSLA"
            required
          />
        </div>
        <div>
          <label>Feature 1: </label>
          <input
            type="number"
            value={feature1}
            onChange={(e) => setFeature1(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 2: </label>
          <input
            type="number"
            value={feature2}
            onChange={(e) => setFeature2(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 3: </label>
          <input
            type="number"
            value={feature3}
            onChange={(e) => setFeature3(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 4: </label>
          <input
            type="number"
            value={feature4}
            onChange={(e) => setFeature4(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 5: </label>
          <input
            type="number"
            value={feature5}
            onChange={(e) => setFeature5(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 6: </label>
          <input
            type="number"
            value={feature6}
            onChange={(e) => setFeature6(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 7: </label>
          <input
            type="number"
            value={feature7}
            onChange={(e) => setFeature7(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 8: </label>
          <input
            type="number"
            value={feature8}
            onChange={(e) => setFeature8(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 9: </label>
          <input
            type="number"
            value={feature9}
            onChange={(e) => setFeature9(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feature 10: </label>
          <input
            type="number"
            value={feature10}
            onChange={(e) => setFeature10(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Prediction"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message if exists */}
      {prediction !== null && (
        <div>
          <h2>Predicted Price: {prediction}</h2>
          <Chart data={historicalData} />{" "}
          {/* Pass historical data to the Chart component */}
        </div>
      )}
    </div>
  );
}

export default App;
