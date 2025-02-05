const mongoose = require("mongoose")

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    stocks: [
      {
        symbol: {type: String, required: true}, // Stock ticker (e.g., "AAPL", "TSLA")
        quantity: {type: Number, required: true}, // Number of shares
        buyPrice: {type: Number, required: true}, // Price at which user bought the stock
        buyDate: {type: Date, default: Date.now}, // Date of purchase
        userId: String,
        createdAt: {type: Date, default: Date.now},
      },
    ],
  },
  {timestamps: true}
)

const PortFolio = mongoose.model("Portfolio", PortfolioSchema)
module.exports = PortFolio
