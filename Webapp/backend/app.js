const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON requests

// Endpoint to get historical stock data from Yahoo Finance
app.get("/historical/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`
    );

    // Check if there's an error in the response
    if (response.data.chart.result.length === 0) {
      return res.status(400).json({ error: "Invalid stock symbol." });
    }

    // Extract the historical data
    const historicalData = response.data.chart.result[0];
    const timestamps = historicalData.timestamp;
    const indicators = historicalData.indicators.adjclose[0].adjclose;

    // Combine timestamps and indicators into an array
    const historicalDataArray = timestamps.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split("T")[0],
      close: indicators[index],
    }));

    res.json(historicalDataArray); // Return the historical data
  } catch (error) {
    console.error("Error fetching historical data:", error.message);
    res.status(500).send("Error fetching historical data");
  }
});

// Endpoint to make predictions
app.post("/predict", async (req, res) => {
  try {
    const predictionResponse = await axios.post(
      "http://localhost:5001/predict", // Flask API endpoint
      req.body
    );
    res.json(predictionResponse.data); // Return the prediction response
    console.log(predictionResponse.data); // Log the prediction data to console
  } catch (error) {
    console.error("Error making prediction:", error.message); // Log the error message
    res.status(500).send("Error making prediction");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node.js server is running on http://localhost:${PORT}`);
});
