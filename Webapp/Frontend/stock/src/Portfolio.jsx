// import {useState, useEffect} from "react"

// const Portfolio = () => {
//   const [stocks, setStocks] = useState([])
//   const [form, setForm] = useState({
//     stockSymbol: "",
//     quantity: "",
//     buyPrice: "",
//   })

//   useEffect(() => {
//     fetchPortfolio()
//   }, [])

//   const fetchPortfolio = async () => {
//     try {
//       const response = await fetch("http://localhost:5002/getuserportfolio", {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       const data = await response.json()
//       if (data.success) {
//         setStocks(data.stocks)
//       } else {
//         console.error("Error fetching portfolio:", data.message)
//       }
//     } catch (error) {
//       console.error("Error fetching portfolio:", error)
//     }
//   }

//   const handleSubmit = async e => {
//     e.preventDefault()
//     try {
//       const response = await fetch("http://localhost:5002/addStock", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       })

//       const data = await response.json()
//       if (data.success) {
//         setForm({stockSymbol: "", quantity: "", buyPrice: ""})
//         fetchPortfolio() // Refresh portfolio after adding stock
//       } else {
//         console.error("Error adding stock:", data.message)
//       }
//     } catch (error) {
//       console.error("Error adding stock:", error)
//     }
//   }

//   return (
//     <div>
//       <h2>Portfolio Management</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Stock Symbol"
//           value={form.stockSymbol}
//           onChange={e => setForm({...form, stockSymbol: e.target.value})}
//           required
//         />
//         <input
//           type="number"
//           placeholder="Quantity"
//           value={form.quantity}
//           onChange={e => setForm({...form, quantity: e.target.value})}
//           required
//         />
//         <input
//           type="number"
//           placeholder="Buy Price"
//           value={form.buyPrice}
//           onChange={e => setForm({...form, buyPrice: e.target.value})}
//           required
//         />
//         <button type="submit">Add Stock</button>
//       </form>

//       <h3>Portfolio</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Stock</th>
//             <th>Qty</th>
//             <th>Buy Price</th>
//             <th>Current Price</th>
//             <th>Profit/Loss</th>
//             <th>% Change</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stocks.map(stock => (
//             <tr key={stock.stockSymbol}>
//               <td>{stock.stockSymbol}</td>
//               <td>{stock.quantity}</td>
//               <td>{stock.buyPrice}</td>
//               <td>{stock.currentPrice}</td>
//               <td style={{color: stock.profitLoss >= 0 ? "green" : "red"}}>
//                 {stock.profitLoss}
//               </td>
//               <td>{stock.profitLossPercentage}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default Portfolio
// import React, {useState, useEffect} from "react"
// import {
//   Button,
//   TextField,
//   Container,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material"
// import {Line} from "react-chartjs-2"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js"
// import Navbar from "./Navbar"

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )

// const Portfolio = () => {
//   const [stocks, setStocks] = useState([])
//   const [form, setForm] = useState({
//     stockSymbol: "",
//     quantity: "",
//     buyPrice: "",
//   })

//   // const fetchPortfolio = async () => {
//   //   try {
//   //     const response = await fetch("http://localhost:5002/getuserportfolio", {
//   //       method: "GET",
//   //       credentials: "include",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     })
//   //     const data = await response.json()
//   //     console.log(data + "lavde")
//   //     if (data.success) {
//   //       setStocks(data.stocks)
//   //     } else {
//   //       console.error("Error fetching portfolio:", data.message)
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching portfolio:", error)
//   //   }
//   // }
//   const fetchPortfolio = async () => {
//     try {
//       const response = await fetch("http://localhost:5002/getuserportfolio", {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           // Add authorization header if needed
//           // "Authorization": `Bearer ${token}`
//         },
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch portfolio")
//       }

//       if (data.success) {
//         // The backend now returns portfolio.stocks and portfolio.summary
//         const {stocks, summary} = data.portfolio

//         console.log("Fetched portfolio data:", data.portfolio)

//         // Set stocks in your state
//         setStocks(stocks)

//         // If you have a state for portfolio summary, you can set that too
//         // setPortfolioSummary(summary);

//         return {
//           stocks,
//           summary,
//         }
//       } else {
//         console.error("Error fetching portfolio:", data.message)
//         throw new Error(data.message || "Failed to fetch portfolio")
//       }
//     } catch (error) {
//       console.error("Error fetching portfolio:", error)
//       // You might want to handle this error in your UI
//       // setError(error.message);
//       throw error // Re-throw if you want to handle the error in the calling component
//     }
//   }

//   // Example usage in a React component:
//   /*
//   const loadPortfolio = async () => {
//     try {
//       const portfolioData = await fetchPortfolio();
//       // Do something with the data
//       console.log("Portfolio loaded:", portfolioData);
//     } catch (err) {
//       // Display error to user
//       alert(`Error: ${err.message}`);
//     }
//   }
//   */
//   useEffect(() => {
//     fetchPortfolio()
//   }, [])

//   const handleSubmit = async e => {
//     e.preventDefault()
//     try {
//       const response = await fetch("http://localhost:5002/addStock", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       })
//       const data = await response.json()
//       if (data.success) {
//         setForm({stockSymbol: "", quantity: "", buyPrice: ""})
//         fetchPortfolio() // Refresh portfolio after adding stock
//       } else {
//         console.error("Error adding stock:", data.message)
//       }
//     } catch (error) {
//       console.error("Error adding stock:", error)
//     }
//   }

//   const chartData = {
//     labels: stocks.map(stock => stock.stockSymbol),
//     datasets: [
//       {
//         label: "Profit/Loss",
//         data: stocks.map(stock => parseFloat(stock.profitLoss)),
//         borderColor: "rgba(75, 192, 192, 1)",
//         fill: false,
//       },
//     ],
//   }

//   return (
//     <Container maxWidth="md" style={{marginTop: "50px"}}>
//       {/* <Navbar></Navbar> */}
//       <Typography variant="h4" gutterBottom align="center">
//         Portfolio Management
//       </Typography>

//       <form onSubmit={handleSubmit}>
//         <Card style={{marginBottom: "20px", padding: "20px"}}>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Add Stock
//             </Typography>
//             <TextField
//               label="Stock Symbol"
//               variant="outlined"
//               value={form.stockSymbol}
//               onChange={e => setForm({...form, stockSymbol: e.target.value})}
//               fullWidth
//               required
//               margin="normal"
//             />
//             <TextField
//               label="Quantity"
//               variant="outlined"
//               type="number"
//               value={form.quantity}
//               onChange={e => setForm({...form, quantity: e.target.value})}
//               fullWidth
//               required
//               margin="normal"
//             />
//             <TextField
//               label="Buy Price"
//               variant="outlined"
//               type="number"
//               value={form.buyPrice}
//               onChange={e => setForm({...form, buyPrice: e.target.value})}
//               fullWidth
//               required
//               margin="normal"
//             />
//             <Button variant="contained" type="submit" fullWidth>
//               Add Stock
//             </Button>
//           </CardContent>
//         </Card>
//       </form>

//       <Typography variant="h5" gutterBottom>
//         Portfolio
//       </Typography>

//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Stock</TableCell>
//               <TableCell>Qty</TableCell>
//               <TableCell>Buy Price</TableCell>
//               <TableCell>Current Price</TableCell>
//               <TableCell>Profit/Loss</TableCell>
//               <TableCell>% Change</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {stocks.map(stock => (
//               <TableRow key={stock.stockSymbol}>
//                 <TableCell>{stock.stockSymbol}</TableCell>
//                 <TableCell>{stock.quantity}</TableCell>
//                 <TableCell>{stock.buyPrice}</TableCell>
//                 <TableCell>{stock.currentPrice}</TableCell>
//                 <TableCell
//                   style={{color: stock.profitLoss >= 0 ? "green" : "red"}}
//                 >
//                   {stock.profitLoss}
//                 </TableCell>
//                 <TableCell>{stock.profitLossPercentage}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Typography variant="h5" gutterBottom>
//         Portfolio Performance
//       </Typography>
//       <Line data={chartData} />
//     </Container>
//   )
// }

// export default Portfolio
import React, {useState, useEffect} from "react"
import {
  Button,
  TextField,
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material"
import {Line} from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Portfolio = () => {
  const [stocks, setStocks] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    stockSymbol: "",
    quantity: "",
    buyPrice: "",
  })

  const fetchPortfolio = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5002/getuserportfolio", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch portfolio")
      }

      if (data.success) {
        // Process stocks to handle null/undefined values
        const processedStocks = data.portfolio.stocks.map(stock => ({
          ...stock,
          currentPrice: stock.currentPrice || "N/A",
          currentValue: stock.currentValue || "N/A",
          profitLoss: stock.profitLoss || "N/A",
          profitLossPercent: stock.profitLossPercent || "N/A",
          dayChange: stock.dayChange || "N/A",
          dayChangePercent: stock.dayChangePercent || "N/A",
          hasMarketData: !stock.yahooError,
        }))

        setStocks(processedStocks)
        setSummary(data.portfolio.summary)
      } else {
        throw new Error(data.message || "Failed to fetch portfolio")
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5002/addStock", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: form.stockSymbol,
          quantity: form.quantity,
          buyPrice: form.buyPrice,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setForm({stockSymbol: "", quantity: "", buyPrice: ""})
        fetchPortfolio() // Refresh portfolio after adding stock
      } else {
        setError(data.message || "Error adding stock")
      }
    } catch (error) {
      console.error("Error adding stock:", error)
      setError("Error adding stock")
    }
  }

  // Prepare chart data only for stocks with market data
  const chartData = {
    labels: stocks
      .filter(stock => stock.hasMarketData)
      .map(stock => stock.symbol),
    datasets: [
      {
        label: "Profit/Loss",
        data: stocks
          .filter(stock => stock.hasMarketData && stock.profitLoss !== "N/A")
          .map(stock => parseFloat(stock.profitLoss)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: stocks.map(stock =>
          stock.profitLoss !== "N/A" && parseFloat(stock.profitLoss) >= 0
            ? "rgba(0, 200, 83, 0.2)"
            : "rgba(255, 99, 132, 0.2)"
        ),
        fill: false,
      },
    ],
  }

  const getColorForValue = value => {
    if (value === "N/A") return "default"
    const numValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.-]/g, ""))
        : value
    return numValue >= 0 ? "success" : "error"
  }

  const formatValue = value => {
    if (value === "N/A") return value
    if (typeof value === "string" && value.endsWith("%")) return value
    return typeof value === "number" ? value.toFixed(2) : value
  }

  return (
    <Container maxWidth="md" style={{marginTop: "50px"}}>
      <Typography variant="h4" gutterBottom align="center">
        Portfolio Management
      </Typography>

      {error && (
        <Card style={{marginBottom: "20px", backgroundColor: "#ffebee"}}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card style={{marginBottom: "20px"}}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Portfolio Summary
            </Typography>
            <Typography>
              Total Investment: ₹{summary.totalInvestment}
            </Typography>
            <Typography>
              Current Value:{" "}
              {summary.totalCurrentValue !== "N/A"
                ? `₹${summary.totalCurrentValue}`
                : "N/A"}
            </Typography>
            <Typography>
              Profit/Loss:{" "}
              <Chip
                label={
                  summary.totalProfitLoss !== "N/A"
                    ? `₹${summary.totalProfitLoss}`
                    : "N/A"
                }
                color={getColorForValue(summary.totalProfitLoss)}
                size="small"
              />
            </Typography>
            <Typography>
              Profit/Loss (%):{" "}
              <Chip
                label={
                  summary.totalProfitLossPercent !== "N/A"
                    ? summary.totalProfitLossPercent
                    : "N/A"
                }
                color={getColorForValue(summary.totalProfitLossPercent)}
                size="small"
              />
            </Typography>
            {summary.dataStatus && (
              <Typography variant="caption" color="textSecondary">
                {summary.dataStatus}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card style={{marginBottom: "20px", padding: "20px"}}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Stock
            </Typography>
            <TextField
              label="Stock Symbol"
              variant="outlined"
              value={form.stockSymbol}
              onChange={e =>
                setForm({...form, stockSymbol: e.target.value.toUpperCase()})
              }
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Quantity"
              variant="outlined"
              type="number"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Buy Price (₹)"
              variant="outlined"
              type="number"
              value={form.buyPrice}
              onChange={e => setForm({...form, buyPrice: e.target.value})}
              fullWidth
              required
              margin="normal"
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              style={{marginTop: "10px"}}
            >
              Add Stock
            </Button>
          </CardContent>
        </Card>
      </form>

      {loading ? (
        <Typography>Loading portfolio...</Typography>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Your Holdings
          </Typography>

          <TableContainer component={Paper} style={{marginBottom: "20px"}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Buy Price (₹)</TableCell>
                  <TableCell align="right">Current Price (₹)</TableCell>
                  <TableCell align="right">Invested (₹)</TableCell>
                  <TableCell align="right">Current Value (₹)</TableCell>
                  <TableCell align="right">P/L (₹)</TableCell>
                  <TableCell align="right">P/L (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map(stock => (
                  <TableRow key={stock.symbol}>
                    <TableCell>
                      {stock.symbol}
                      {!stock.hasMarketData && (
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          display="block"
                        >
                          Market data unavailable
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">{stock.quantity}</TableCell>
                    <TableCell align="right">{stock.buyPrice}</TableCell>
                    <TableCell align="right">
                      {formatValue(stock.currentPrice)}
                    </TableCell>
                    <TableCell align="right">{stock.investmentValue}</TableCell>
                    <TableCell align="right">
                      {formatValue(stock.currentValue)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={formatValue(stock.profitLoss)}
                        color={getColorForValue(stock.profitLoss)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={formatValue(stock.profitLossPercent)}
                        color={getColorForValue(stock.profitLossPercent)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {stocks.some(stock => stock.hasMarketData) && (
            <>
              <Typography variant="h5" gutterBottom>
                Portfolio Performance
              </Typography>
              <Card style={{marginBottom: "20px"}}>
                <CardContent>
                  <Line data={chartData} />
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </Container>
  )
}

export default Portfolio
