const Portfolio = require("../Db/portfolio")
const mongoose = require("mongoose")
const addStock = async (req, res) => {
  console.log("add stock Called ")
  console.log(req.user)

  try {
    const {symbol, quantity, buyPrice} = req.body
    // const userId = new mongoose.Types.ObjectId("60d3b41abdacab002f3c6f2e") // Use a valid ObjectId
    const userId = req.user._id

    let portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      portfolio = new Portfolio({userId, stocks: []})
    }

    portfolio.stocks.push({symbol, quantity, buyPrice})
    await portfolio.save()

    res.json({success: true, message: "Stock added to portfolio", portfolio})
  } catch (error) {
    // Log the error more thoroughly
    console.error("Error adding stock:", error) // Log the full error to the server's console
    res.status(500).json({
      success: false,
      message: "Error adding stock",
      error: error.message || error,
    })
  }
}

const getPortfolio = async (req, res) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    const portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      return res
        .status(404)
        .json({success: false, message: "Portfolio not found"})
    }

    res.json({success: true, portfolio})
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
      error: error.message,
    })
  }
}

// ✅ Remove a stock from portfolio
const removeStock = async (req, res) => {
  try {
    const {symbol} = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    let portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      return res
        .status(404)
        .json({success: false, message: "Portfolio not found"})
    }

    portfolio.stocks = portfolio.stocks.filter(stock => stock.symbol !== symbol)
    await portfolio.save()

    res.json({
      success: true,
      message: "Stock removed from portfolio",
      portfolio,
    })
  } catch (error) {
    console.error("Error removing stock:", error)
    res.status(500).json({
      success: false,
      message: "Error removing stock",
      error: error.message,
    })
  }
}
module.exports = {addStock, getPortfolio, removeStock}
