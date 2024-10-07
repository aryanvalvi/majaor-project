const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON requests

// Endpoint to get historical stock data from Yahoo Finance
app.get("/historicall/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=1mo&interval=1d`;

  try {
    const response = await axios.get(url);
    const chartData = response.data.chart.result[0];
    const timestamps = chartData.timestamp;
    const quote = chartData.indicators.quote[0];

    const candlestickData = timestamps.map((time, i) => ({
      timestamp: new Date(time * 1000).toLocaleDateString(),
      open: quote.open[i],
      high: quote.high[i],
      low: quote.low[i],
      close: quote.close[i],
    }));

    res.json(candlestickData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch historical data" });
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
