import React, { useEffect, useState } from "react";
import "./portfolio.css";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const savedPortfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    setPortfolio(savedPortfolio);
  }, []);

  const calculatePercentageChange = (initialPrice, currentPrice) => {
    if (initialPrice === 0) return 0;
    return (((currentPrice - initialPrice) / initialPrice) * 100).toFixed(2);
  };

  return (
    <div className="portfolio-container">
      <h1>Your Portfolio</h1>
      {portfolio.length > 0 ? (
        portfolio.map((stock, index) => {
          const currentPriceBSE = stock.currentPrice.BSE;
          const currentPriceNSE = stock.currentPrice.NSE;

          const percentageChangeBSE = calculatePercentageChange(
            stock.investment,
            currentPriceBSE
          );

          const percentageChangeNSE = calculatePercentageChange(
            stock.investment,
            currentPriceNSE
          );

          return (
            <div key={index} className="portfolio-item">
              <h3>{stock.companyName}</h3>
              <p>Invested Amount: {stock.investment}</p>
              {/* Row with BSE and NSE prices and percentage changes */}
              <div className="price-percentage-row">
                <p>Current Price (BSE): {currentPriceBSE}₹</p>
                <p>Current Price (NSE): {currentPriceNSE}₹</p>
                <p>
                  Percent Change (BSE):
                  <span
                    className={
                      percentageChangeBSE < 0
                        ? "negative-change"
                        : "positive-change"
                    }
                  >
                    {percentageChangeBSE}% {percentageChangeBSE < 0 ? "↓" : "↑"}
                  </span>
                </p>
                <p>
                  Percent Change (NSE):
                  <span
                    className={
                      percentageChangeNSE < 0
                        ? "negative-change"
                        : "positive-change"
                    }
                  >
                    {percentageChangeNSE}% {percentageChangeNSE < 0 ? "↓" : "↑"}
                  </span>
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p>No investments made yet.</p>
      )}
    </div>
  );
}

export default Portfolio;
