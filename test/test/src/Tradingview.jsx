// src/Tradingview.js
import React, { useEffect, useRef } from "react";

const Tradingview = ({ symbol }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const loadChart = () => {
      if (chartRef.current && window.TradingView) {
        new window.TradingView.widget({
          container_id: chartRef.current.id, // Ensure we're using the id
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          hide_side_toolbar: false,
          studies: [],
          hideideas: true,
        });
      } else {
        console.error("TradingView is not loaded or chartRef is null");
      }
    };

    // Delay the chart load to ensure TradingView is fully loaded
    const interval = setInterval(() => {
      loadChart();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [symbol]);

  return (
    <div
      ref={chartRef}
      id="tradingview-chart" // Add an ID to the div
      style={{ position: "relative", height: "600px", width: "100%" }}
    />
  );
};

export default Tradingview;
