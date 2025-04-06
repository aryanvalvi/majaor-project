const Portfolio = require("../Db/portfolio")
const yahooFinance = require("yahoo-finance2").default

// ✅ Add a stock to user's portfolio
exports.addStocck = async (req, res) => {
  const userId = req.user._id
  try {
    const {stockSymbol, quantity, buyPrice} = req.body

    let portfolio = await Portfolio.findOne({userId})

    if (!portfolio) {
      portfolio = new Portfolio({userId, stocks: []})
    }

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

// ✅ Get Indian stock price using Yahoo Finance
async function getIndianStockPrice(symbol) {
  try {
    const fullSymbol = `${symbol}.NS` // Add .NS for NSE stocks
    const quote = await yahooFinance.quote(fullSymbol)

    return {
      price: quote.regularMarketPrice,
      currency: quote.currency,
      source: "Yahoo Finance",
    }
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message)
    return null
  }
}

// ✅ Get user's portfolio with P&L
exports.getPortfolioo = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    const portfolio = await Portfolio.findOne({userId})
    if (!portfolio?.stocks?.length) {
      return res
        .status(404)
        .json({success: false, message: "Portfolio not found or empty"})
    }

    const stocksWithDetails = await Promise.all(
      portfolio.stocks.map(async stock => {
        const priceInfo = await getIndianStockPrice(stock.symbol)

        const investment = stock.quantity * stock.buyPrice
        const currentValue = priceInfo?.price
          ? stock.quantity * priceInfo.price
          : null

        return {
          symbol: stock.symbol,
          quantity: stock.quantity,
          buyPrice: stock.buyPrice,
          currentPrice: priceInfo?.price || "N/A",
          investmentValue: investment.toFixed(2),
          currentValue: currentValue ? currentValue.toFixed(2) : "N/A",
          profitLoss: currentValue
            ? (currentValue - investment).toFixed(2)
            : "N/A",
          profitLossPercent: currentValue
            ? (((currentValue - investment) / investment) * 100).toFixed(2) +
              "%"
            : "N/A",
          currency: priceInfo?.currency || "N/A",
          dataSource: priceInfo?.source || "none",
          lastUpdated: new Date().toISOString(),
        }
      })
    )

    const summary = stocksWithDetails.reduce(
      (acc, stock) => {
        acc.totalInvestment += parseFloat(stock.investmentValue)
        if (stock.currentValue !== "N/A") {
          acc.totalCurrentValue += parseFloat(stock.currentValue)
        }
        return acc
      },
      {totalInvestment: 0, totalCurrentValue: 0}
    )

    const totalProfitLoss = summary.totalCurrentValue - summary.totalInvestment
    const totalProfitLossPercent =
      summary.totalInvestment > 0
        ? (totalProfitLoss / summary.totalInvestment) * 100
        : 0

    res.json({
      success: true,
      portfolio: {
        stocks: stocksWithDetails,
        summary: {
          ...summary,
          totalProfitLoss: totalProfitLoss.toFixed(2),
          totalProfitLossPercent: totalProfitLossPercent.toFixed(2) + "%",
        },
      },
    })
  } catch (error) {
    console.error("Error in getPortfolioo:", error.message)
    res.status(500).json({success: false, message: error.message})
  }
}
