// import React, { useEffect, useState } from "react";
// import "./App.css";

// function App() {
//   const [features, setFeatures] = useState({
//     Open: "",
//     High: "",
//     Low: "",
//     Last: "",
//     Close: "",
//     VWAP: "",
//     Volume: "",
//     Turnover: "",
//     Trades: "",
//     "Deliverable Volume": "",
//     "%Deliverable": "",
//   });
//   const [stockSymbol, setStockSymbol] = useState(""); // State for stock symbol
//   const [prediction, setPrediction] = useState(null);
//   const [historicalData, setHistoricalData] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false); // State for loading

//   useEffect(() => {
//     if (historicalData.length > 0) {
//       initTradingViewChart(); // Initialize TradingView chart after data is loaded
//     }
//   }, [historicalData]);

//   // Handle input changes for each feature
//   const handleChange = (e) => {
//     setFeatures({
//       ...features,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError(""); // Reset error message
//     setLoading(true); // Show loading state

//     // Input validation to ensure all fields are filled
//     const allFieldsFilled =
//       Object.values(features).every((feature) => feature !== "") && stockSymbol;
//     if (!allFieldsFilled) {
//       setError("Please enter all features and stock symbol.");
//       setLoading(false); // Reset loading state
//       return;
//     }

//     try {
//       // Send data to backend for prediction
//       const response = await fetch("http://localhost:5000/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           Open: parseFloat(features.Open),
//           High: parseFloat(features.High),
//           Low: parseFloat(features.Low),
//           Last: parseFloat(features.Last),
//           Close: parseFloat(features.Close),
//           VWAP: parseFloat(features.VWAP),
//           Volume: parseFloat(features.Volume),
//           Turnover: parseFloat(features.Turnover),
//           Trades: parseFloat(features.Trades),
//           "Deliverable Volume": parseFloat(features["Deliverable Volume"]),
//           "%Deliverable": parseFloat(features["%Deliverable"]),
//         }),
//       });

//       // Check for HTTP errors
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       setPrediction(result.predictedPrice); // Set the prediction result

//       // Fetch historical data after prediction
//       await fetchHistoricalData(stockSymbol); // Fetch historical data for the stock symbol
//     } catch (err) {
//       console.error(err);
//       setError("Error getting prediction. Try again later."); // Display error message
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   const fetchHistoricalData = async (symbol) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/historicall/${symbol}`,
//         {
//           method: "GET",
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch historical data");
//       }
//       const data = await response.json();
//       console.log(data);
//       setHistoricalData(data); // Set historical data
//     } catch (error) {
//       console.error("Error fetching historical data:", error);
//       setError("Error fetching historical data."); // Display error message
//     }
//   };

//   const initTradingViewChart = () => {
//     new window.TradingView.widget({
//       container_id: "tradingview-chart",
//       width: "100%",
//       height: "400",
//       symbol: `${stockSymbol}`,
//       interval: "D",
//       timezone: "Etc/UTC",
//       theme: "light",
//       style: "1",
//       locale: "en",
//       toolbar_bg: "#f1f3f6",
//       enable_publishing: false,
//       allow_symbol_change: true,
//       datafeed: {
//         getBars: (symbol, resolution, from, to, onHistoryCallback) => {
//           const filteredData = historicalData.filter((dataPoint) => {
//             const timestamp = new Date(dataPoint.timestamp).getTime() / 1000;
//             return timestamp >= from && timestamp <= to;
//           });

//           const bars = filteredData.map((dataPoint) => ({
//             time: new Date(dataPoint.timestamp).getTime() / 1000,
//             open: dataPoint.open,
//             high: dataPoint.high,
//             low: dataPoint.low,
//             close: dataPoint.close,
//           }));

//           onHistoryCallback(bars, { noData: bars.length === 0 });
//         },
//       },
//     });
//   };

//   // Calculate average closing price
//   const averagePrice =
//     historicalData.length > 0
//       ? historicalData.reduce((acc, dataPoint) => acc + dataPoint.close, 0) /
//         historicalData.length
//       : 0;

//   return (
//     <div className="App">
//       <h1>Stock Price Prediction</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Stock Symbol: </label>
//           <input
//             type="text"
//             value={stockSymbol}
//             onChange={(e) => setStockSymbol(e.target.value)}
//             placeholder="e.g., AAPL, TSLA"
//             required
//           />
//         </div>
//         {Object.keys(features).map((feature, index) => (
//           <div key={index}>
//             <label>{feature}: </label>
//             <input
//               type="number"
//               name={feature}
//               value={features[feature]}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         ))}
//         <button type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Get Prediction"}
//         </button>
//       </form>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {prediction !== null && (
//         <div>
//           <h2>Predicted Price: {prediction}</h2>
//           <div id="tradingview-chart"></div>
//           {historicalData.length > 0 && (
//             <div>
//               <h3>Historical Data</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Timestamp</th>
//                     <th>Open</th>
//                     <th>High</th>
//                     <th>Low</th>
//                     <th>Close</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {historicalData.map((dataPoint, index) => (
//                     <tr key={index}>
//                       <td>{dataPoint.timestamp}</td>
//                       <td>{dataPoint.open}</td>
//                       <td>{dataPoint.high}</td>
//                       <td>{dataPoint.low}</td>
//                       <td>{dataPoint.close}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h3>Average Closing Price: {averagePrice.toFixed(2)}</h3>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [features, setFeatures] = useState({
    Open: "",
    High: "",
    Low: "",
    Close: "",
    Volume: "",
  });
  const [stockSymbol, setStockSymbol] = useState(""); // State for stock symbol
  const [prediction, setPrediction] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    if (historicalData.length > 0) {
      initTradingViewChart(); // Initialize TradingView chart after data is loaded
    }
  }, [historicalData]);

  // Handle input changes for each feature
  const handleChange = (e) => {
    setFeatures({
      ...features,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message
    setLoading(true); // Show loading state

    // Input validation to ensure all fields are filled
    const allFieldsFilled =
      Object.values(features).every((feature) => feature !== "") && stockSymbol;
    if (!allFieldsFilled) {
      setError("Please enter all features and stock symbol.");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      // Send only the selected features to the backend
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Open: parseFloat(features.Open),
          High: parseFloat(features.High),
          Low: parseFloat(features.Low),
          Close: parseFloat(features.Close),
          Volume: parseFloat(features.Volume),
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

  const fetchHistoricalData = async (symbol) => {
    try {
      const response = await fetch(
        `http://localhost:5000/historicall/${symbol}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }
      const data = await response.json();
      console.log(data);
      setHistoricalData(data); // Set historical data
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setError("Error fetching historical data."); // Display error message
    }
  };

  const initTradingViewChart = () => {
    new window.TradingView.widget({
      container_id: "tradingview-chart",
      width: "100%",
      height: "400",
      symbol: `${stockSymbol}`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      datafeed: {
        getBars: (symbol, resolution, from, to, onHistoryCallback) => {
          const filteredData = historicalData.filter((dataPoint) => {
            const timestamp = new Date(dataPoint.timestamp).getTime() / 1000;
            return timestamp >= from && timestamp <= to;
          });

          const bars = filteredData.map((dataPoint) => ({
            time: new Date(dataPoint.timestamp).getTime() / 1000,
            open: dataPoint.open,
            high: dataPoint.high,
            low: dataPoint.low,
            close: dataPoint.close,
          }));

          onHistoryCallback(bars, { noData: bars.length === 0 });
        },
      },
    });
  };

  // Calculate average closing price
  const averagePrice =
    historicalData.length > 0
      ? historicalData.reduce((acc, dataPoint) => acc + dataPoint.close, 0) /
        historicalData.length
      : 0;

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
        {Object.keys(features).map((feature, index) => (
          <div key={index}>
            <label>{feature}: </label>
            <input
              type="number"
              name={feature}
              value={features[feature]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Prediction"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {prediction !== null && (
        <div>
          <h2>Predicted Price: {prediction}</h2>
          <div id="tradingview-chart"></div>
          {historicalData.length > 0 && (
            <div>
              <h3>Historical Data</h3>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.map((dataPoint, index) => (
                    <tr key={index}>
                      <td>{dataPoint.timestamp}</td>
                      <td>{dataPoint.open}</td>
                      <td>{dataPoint.high}</td>
                      <td>{dataPoint.low}</td>
                      <td>{dataPoint.close}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3>Average Closing Price: {averagePrice.toFixed(2)}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
