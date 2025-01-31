import React from "react";
import Tradingview from "./Tradingview";

function App() {
  return (
    <div className="App">
      <h1>TradingView Chart in React</h1>
      <Tradingview symbol="NASDAQ:AAPL" />
    </div>
  );
}

export default App;
