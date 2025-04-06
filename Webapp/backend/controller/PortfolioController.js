const Portfolio = require("../Db/portfolio")
const yahooFinance = require("yahoo-finance2").default

const addStock = async (req, res) => {
  console.log("addStock called")

  try {
    if (!req.user?._id) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    const {symbol, quantity, buyPrice} = req.body
    const userId = req.user._id

    // Validate input
    if (!symbol || !quantity || !buyPrice) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: symbol, quantity, or buyPrice",
      })
    }

    let portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      portfolio = new Portfolio({userId, stocks: []})
    }

    // Check if stock already exists in portfolio
    const existingStockIndex = portfolio.stocks.findIndex(
      s => s.symbol === symbol
    )
    if (existingStockIndex >= 0) {
      // Update existing stock
      portfolio.stocks[existingStockIndex].quantity += Number(quantity)
      // You might want to handle buyPrice differently (e.g., weighted average)
    } else {
      // Add new stock
      portfolio.stocks.push({
        symbol: symbol.toUpperCase(),
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
      })
    }

    await portfolio.save()

    return res.json({
      success: true,
      message: "Stock added to portfolio",
      portfolio,
    })
  } catch (error) {
    console.error("Error adding stock:", error)
    return res.status(500).json({
      success: false,
      message: "Error adding stock",
      error: error.message,
    })
  }
}

const getPortfolio = async (req, res) => {
  console.log("getPortfolio called")

  try {
    if (!req.user?._id) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    const userId = req.user._id
    const portfolio = await Portfolio.findOne({userId})

    if (!portfolio || !portfolio.stocks.length) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or empty",
      })
    }

    // Get all symbols for batch query
    const symbols = portfolio.stocks.map(stock => stock.symbol)

    // Get current prices from Yahoo Finance
    const quotes = await yahooFinance.quote(symbols)

    // Calculate portfolio metrics
    let totalInvestment = 0
    let totalCurrentValue = 0

    const stocksWithDetails = portfolio.stocks.map(stock => {
      const quote = quotes.find(q => q.symbol === stock.symbol)
      const currentPrice = quote?.regularMarketPrice || 0
      const investment = stock.quantity * stock.buyPrice
      const currentValue = stock.quantity * currentPrice
      const profitLoss = currentValue - investment
      const profitLossPercent = (profitLoss / investment) * 100

      totalInvestment += investment
      totalCurrentValue += currentValue

      return {
        symbol: stock.symbol,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
        currentPrice: currentPrice,
        investmentValue: investment.toFixed(2),
        currentValue: currentValue.toFixed(2),
        profitLoss: profitLoss.toFixed(2),
        profitLossPercent: profitLossPercent.toFixed(2) + "%",
        currency: quote?.currency || "USD",
        dayChange: quote?.regularMarketChange?.toFixed(2) || "N/A",
        dayChangePercent:
          quote?.regularMarketChangePercent?.toFixed(2) + "%" || "N/A",
      }
    })

    const totalProfitLoss = totalCurrentValue - totalInvestment
    const totalProfitLossPercent = (totalProfitLoss / totalInvestment) * 100

    return res.json({
      success: true,
      portfolio: {
        stocks: stocksWithDetails,
        summary: {
          totalInvestment: totalInvestment.toFixed(2),
          totalCurrentValue: totalCurrentValue.toFixed(2),
          totalProfitLoss: totalProfitLoss.toFixed(2),
          totalProfitLossPercent: totalProfitLossPercent.toFixed(2) + "%",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
      error: error.message,
    })
  }
}

const removeStock = async (req, res) => {
  console.log("removeStock called")

  try {
    if (!req.user?._id) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    const {symbol} = req.body
    const userId = req.user._id

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Stock symbol is required",
      })
    }

    let portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      })
    }

    const initialStockCount = portfolio.stocks.length
    portfolio.stocks = portfolio.stocks.filter(
      stock => stock.symbol !== symbol.toUpperCase()
    )

    if (portfolio.stocks.length === initialStockCount) {
      return res.status(404).json({
        success: false,
        message: "Stock not found in portfolio",
      })
    }

    await portfolio.save()

    return res.json({
      success: true,
      message: "Stock removed from portfolio",
      portfolio,
    })
  } catch (error) {
    console.error("Error removing stock:", error)
    return res.status(500).json({
      success: false,
      message: "Error removing stock",
      error: error.message,
    })
  }
}

module.exports = {addStock, getPortfolio, removeStock}
