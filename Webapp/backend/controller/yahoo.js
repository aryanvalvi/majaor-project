const Portfolio = require("../Db/portfolio")
const yahooFinance = require("yahoo-finance2").default

// ✅ Add a stock to user's portfolio
exports.addStocck = async (req, res) => {
  const userId = req.user._id
  try {
    const {stockSymbol, quantity, buyPrice} = req.body

    // Check if user already has a portfolio
    let portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      // Create a new portfolio if it doesn't exist
      portfolio = new Portfolio({userId, stocks: []})
    }

    // Add new stock to the stocks array
    portfolio.stocks.push({
      symbol: stockSymbol,
      quantity,
      buyPrice,
    })

    await portfolio.save()

    res.json({success: true, message: "Stock added to portfolio"})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

// ✅ Get user's portfolio with profit/loss calculations
exports.getPortfolioo = async (req, res) => {
  try {
    const userId = req.user._id
    const portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      return res.json({
        success: true,
        stocks: [],
        totalPortfolioValue: "0.00",
        totalProfitLoss: "0.00",
      })
    }

    let totalValue = 0
    let totalProfitLoss = 0
    let stocksData = []

    for (const stock of portfolio.stocks) {
      const currentPrice = (await yahooFinance.quote(stock.symbol))
        .regularMarketPrice
      const investmentValue = stock.quantity * stock.buyPrice
      const currentValue = stock.quantity * currentPrice
      const profitLoss = currentValue - investmentValue

      totalValue += currentValue
      totalProfitLoss += profitLoss

      stocksData.push({
        stockSymbol: stock.symbol,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
        currentPrice,
        profitLoss: profitLoss.toFixed(2),
        profitLossPercentage:
          ((profitLoss / investmentValue) * 100).toFixed(2) + "%",
      })
    }

    res.json({
      success: true,
      totalPortfolioValue: totalValue.toFixed(2),
      totalProfitLoss: totalProfitLoss.toFixed(2),
      stocks: stocksData,
    })
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}
