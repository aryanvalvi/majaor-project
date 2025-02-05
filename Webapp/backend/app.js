const express = require("express")
const axios = require("axios")
const cors = require("cors")
const passport = require("passport")
const passportSetup = require("./config/passport-setup")
const {default: mongoose} = require("mongoose")
const yahooFinance = require("yahoo-finance2").default
const router = require("./routes/route")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const app = express()

app.use(express.json()) // Middleware to parse JSON requests
const dotenv = require("dotenv")
dotenv.config()

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
)

// Session management
app.use(
  session({
    secret: "asdasfafverwfrvvklmn",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}, // Set to `true` if using HTTPS
  })
)
app.options("/add", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.header("Access-Control-Allow-Methods", "POST")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  res.header("Access-Control-Allow-Credentials", "true")
  res.send()
})

// Passport.js setup
app.use(passport.initialize())
app.use(passport.session())

// Endpoint to get historical stock data from Yahoo Finance
app.get("/historicall/:symbol", async (req, res) => {
  const symbol = req.params.symbol
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=1mo&interval=1d`

  try {
    const response = await axios.get(url)
    const chartData = response.data.chart.result[0]
    const timestamps = chartData.timestamp
    const quote = chartData.indicators.quote[0]

    const candlestickData = timestamps.map((time, i) => ({
      timestamp: new Date(time * 1000).toLocaleDateString(),
      open: quote.open[i],
      high: quote.high[i],
      low: quote.low[i],
      close: quote.close[i],
    }))

    res.json(candlestickData)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "Failed to fetch historical data"})
  }
})

// Endpoint to make predictions
app.post("/predict", async (req, res) => {
  try {
    const predictionResponse = await axios.post(
      "http://localhost:5003/predict", // Flask API endpoint
      req.body
    )
    res.json(predictionResponse.data) // Return the prediction response
    console.log(predictionResponse.data) // Log the prediction data to console
  } catch (error) {
    console.error("Error making prediction:", error.message) // Log the error message
    res.status(500).send("Error making prediction")
  }
})

app.get("/api/stock/:symbol", async (req, res) => {
  const {symbol} = req.params

  // Define the options for the API request
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
    params: {symbol: symbol, region: "IN"}, // Use 'IN' for Indian region
    headers: {
      "x-rapidapi-key": "2163e774demsha7b7f665d1d28e9p168c2ejsn99441c063973", // Replace with your RapidAPI key
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    },
  }

  try {
    // Make the request to the Yahoo Finance API
    const response = await axios.request(options)

    // Send the stock data back to the client
    res.json(response.data)
  } catch (error) {
    // Handle any errors and send a 500 response
    console.error("Error fetching stock data:", error)
    res.status(500).json({error: "Failed to fetch stock data"})
  }
})

app.use("/", router)
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("connected to db")
  })
  .catch(err => {
    console.log("Database connection error: " + err)
  })

const PORT = 5002
app.listen(PORT, () => {
  console.log(`Node.js server is running on http://localhost:${PORT}`)
})
