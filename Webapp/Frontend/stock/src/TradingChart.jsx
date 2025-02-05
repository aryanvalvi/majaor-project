import React, {useState, useEffect} from "react"

function TradingViewLiveChart() {
  const [showChart, setShowChart] = useState(false)
  const [symbol, setSymbol] = useState("AAPL") // Default stock symbol

  // Dynamically load TradingView script
  useEffect(() => {
    if (showChart) {
      const tradingViewScript = document.createElement("script")
      tradingViewScript.src = "https://s3.tradingview.com/tv.js"
      tradingViewScript.async = true
      document.head.appendChild(tradingViewScript)

      tradingViewScript.onload = () => {
        new window.TradingView.widget({
          container_id: "tradingview-live-chart", // Div ID for the chart
          width: "100%",
          height: "600px",
          symbol: symbol, // Dynamic symbol
          interval: "1", // Interval in minutes
          timezone: "Etc/UTC",
          theme: "light",
          style: "1", // Candlestick chart style
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          withdateranges: true,
          hide_side_toolbar: false,
          studies: ["Moving Average"],
          datafeed: {
            getBars: (symbol, resolution, from, to, onHistoryCallback) => {
              const randomPriceChange = Math.random() * 2 - 1 // Random change between -1 and 1
              const currentPrice = 145 + randomPriceChange // Current base price + random change

              const bars = [
                {
                  time: Date.now() / 1000, // Current time in seconds
                  open: currentPrice,
                  high: currentPrice + Math.random() * 2,
                  low: currentPrice - Math.random() * 2,
                  close: currentPrice + Math.random() * 2,
                },
              ]

              onHistoryCallback(bars, {noData: bars.length === 0})
            },
          },
        })
      }
    }
  }, [showChart, symbol])

  // Handle button click to show chart
  const handleButtonClick = () => {
    setShowChart(true) // Set to true to load the TradingView chart
  }

  // Handle symbol change input
  const handleSymbolChange = event => {
    setSymbol(event.target.value) // Change the symbol based on user input
  }

  return (
    <div>
      <h1 style={{textAlign: "center", marginBottom: "20px"}}>
        Live Stock Chart (Simulated Movement)
      </h1>

      {/* Symbol Input */}
      <div style={{textAlign: "center", marginBottom: "20px"}}>
        <input
          type="text"
          placeholder="Enter Stock Symbol"
          value={symbol}
          onChange={handleSymbolChange}
          style={{padding: "10px", fontSize: "16px", marginRight: "10px"}}
        />
        <button
          onClick={handleButtonClick}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Show Live Chart
        </button>
      </div>

      {/* Only show the TradingView chart if showChart is true */}
      {showChart && (
        <div
          id="tradingview-live-chart"
          style={{width: "100%", height: "600px", marginTop: "20px"}}
        ></div>
      )}
    </div>
  )
}

export default TradingViewLiveChart
