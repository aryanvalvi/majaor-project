import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./rapid.css";
function Rapid() {
  const [data, setData] = useState(null);
  const [text, setText] = useState("");
  const [isClick, setIsClick] = useState(false);
  const [investment, setInvestment] = useState(0);
  const navigate = useNavigate();
  const handleCheck = () => {
    console.log(text);
    setIsClick(true);
  };

  const handleInvest = () => {
    const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    const fetchedData = [data.currentPrice.bse, data.currentPrice.nse];
    const stockData = { ...data, investment };
    portfolio.push(stockData);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    navigate("/portfolio");
  };

  // this is to fetch data
  const fetchApi = async () => {
    const url = `https://livemint-api.p.rapidapi.com/stock?name=${text}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "73d74f9a60msh37241f6b628f724p1d7f52jsn34cb56db49ea",
        "x-rapidapi-host": "livemint-api.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsClick(false);
    }
  };

  useEffect(() => {
    if (isClick && text) {
      fetchApi();
    }
    console.log(data);
  }, [isClick]);

  return (
    <div className="rapid-container">
      <h1 className="header-text">Search & Invest</h1>
      <div className="input-button-container">
        <input
          type="text"
          placeholder="Enter something"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="check-button" onClick={handleCheck}>
          Check
        </button>
      </div>
      {data && (
        <div className="stock-info">
          {/* Left Section */}
          <div className="left-section">
            <div className="grouped-data-item">
              <div className="data-line">
                <span>Current Price (BSE):</span>
                <span>{data.currentPrice.BSE}₹</span>
              </div>
              <div className="data-line">
                <span>Current Price (NSE):</span>
                <span>{data.currentPrice.NSE}₹</span>
              </div>
              <div className="data-line">
                <span>Percent Change:</span>
                <span>{data.percentChange}₹</span>
              </div>
              <div className="data-line">
                <span>Volume:</span>
                <span>{data.volume}</span>
              </div>
              <div className="data-line">
                <span>Year High:</span>
                <span>{data.yearHigh}₹</span>
              </div>
              <div className="data-line">
                <span>Year Low:</span>
                <span>{data.yearLow}₹</span>
              </div>
              <div className="data-line">
                <span>Market Cap:</span>
                <span>{data.stockDetailsReusableData.marketCap}</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="right-section">
            <div className="news-content">
              <img
                src={data.recentNews[0].thumbnailimage}
                alt="News Thumbnail"
              />
              <div className="headline-container">
                <h3>{data.recentNews[0].headline}</h3>
                <a href={data.recentNews[0].url}>Read More</a>
                <p>{data.recentNews[0].date}</p>
              </div>
            </div>
            <div className="investment-container">
              <input
                type="number"
                placeholder="Enter the investment amount"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
              />
              <button onClick={handleInvest}>Invest</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rapid;
