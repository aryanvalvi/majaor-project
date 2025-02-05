import React, {useEffect, useState} from "react"
import "./App.scss"

function App() {
  const [features, setFeatures] = useState({
    Open: "",
    High: "",
    Low: "",
    Close: "",
    Volume: "",
  })
  const [stockSymbol, setStockSymbol] = useState("")
  const [prediction, setPrediction] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (historicalData.length > 0) {
      initTradingViewChart()
    }
  }, [historicalData])

  const handleChange = e => {
    setFeatures({
      ...features,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError("")
    setLoading(true)

    const allFieldsFilled =
      Object.values(features).every(feature => feature !== "") && stockSymbol
    if (!allFieldsFilled) {
      setError("Please enter all features and stock symbol.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5002/predict", {
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
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      setPrediction(result.predictedPrice)

      // Fetch historical data after prediction
      await fetchHistoricalData(stockSymbol)
    } catch (err) {
      console.error(err)
      setError("Error getting prediction. Try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchHistoricalData = async symbol => {
    try {
      const response = await fetch(
        `http://localhost:5002/historicall/${symbol}`,
        {
          method: "GET",
        }
      )
      if (!response.ok) {
        throw new Error("Failed to fetch historical data")
      }
      const data = await response.json()
      setHistoricalData(data)
    } catch (error) {
      console.error("Error fetching historical data:", error)
      setError("Error fetching historical data.")
    }
  }

  const initTradingViewChart = () => {
    new window.TradingView.widget({
      container_id: "tradingview-chart",
      width: "100%",
      height: "600",
      symbol: `${stockSymbol}`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      withdateranges: true,
      hide_side_toolbar: false,
      drawings_access: {
        type: "all_symbols",
        tools: [
          {name: "Trend Line"},
          {name: "Horizontal Line"},
          {name: "Vertical Line"},
          {name: "Fibonacci Retracement"},
          {name: "Text"},
        ],
      },
      studies: ["Moving Average"],
      datafeed: {
        getBars: (symbol, resolution, from, to, onHistoryCallback) => {
          const filteredData = historicalData.filter(dataPoint => {
            const timestamp = new Date(dataPoint.timestamp).getTime() / 1000
            return timestamp >= from && timestamp <= to
          })

          const bars = filteredData.map(dataPoint => ({
            time: new Date(dataPoint.timestamp).getTime() / 1000,
            open: dataPoint.open,
            high: dataPoint.high,
            low: dataPoint.low,
            close: dataPoint.close,
          }))

          onHistoryCallback(bars, {noData: bars.length === 0})
        },
      },
    })
  }

  return (
    <div className="App">
      <h1 className="HeaderStockName">Stock Price Prediction</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="left-form">
          <div>
            <label>Stock Symbol: </label>
            <input
              type="text"
              value={stockSymbol}
              onChange={e => setStockSymbol(e.target.value)}
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
        </div>
        <div className="trading" id="tradingview-chart"></div>
      </form>
      <div className="predictedPrice">
        {error && <p style={{color: "red"}}>{error}</p>}
        {prediction !== null && <h2>Predicted Price: {prediction}</h2>}
      </div>
    </div>
  )
}

export default App
