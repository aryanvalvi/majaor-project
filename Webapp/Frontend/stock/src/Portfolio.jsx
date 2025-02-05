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
import Navbar from "./Navbar"

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
  const [form, setForm] = useState({
    stockSymbol: "",
    quantity: "",
    buyPrice: "",
  })

  const fetchPortfolio = async () => {
    try {
      const response = await fetch("http://localhost:5002/getuserportfolio", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (data.success) {
        setStocks(data.stocks)
      } else {
        console.error("Error fetching portfolio:", data.message)
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
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
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (data.success) {
        setForm({stockSymbol: "", quantity: "", buyPrice: ""})
        fetchPortfolio() // Refresh portfolio after adding stock
      } else {
        console.error("Error adding stock:", data.message)
      }
    } catch (error) {
      console.error("Error adding stock:", error)
    }
  }

  const chartData = {
    labels: stocks.map(stock => stock.stockSymbol),
    datasets: [
      {
        label: "Profit/Loss",
        data: stocks.map(stock => parseFloat(stock.profitLoss)),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  }

  return (
    <Container maxWidth="md" style={{marginTop: "50px"}}>
      {/* <Navbar></Navbar> */}
      <Typography variant="h4" gutterBottom align="center">
        Portfolio Management
      </Typography>

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
              onChange={e => setForm({...form, stockSymbol: e.target.value})}
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
              label="Buy Price"
              variant="outlined"
              type="number"
              value={form.buyPrice}
              onChange={e => setForm({...form, buyPrice: e.target.value})}
              fullWidth
              required
              margin="normal"
            />
            <Button variant="contained" type="submit" fullWidth>
              Add Stock
            </Button>
          </CardContent>
        </Card>
      </form>

      <Typography variant="h5" gutterBottom>
        Portfolio
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stock</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Buy Price</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Profit/Loss</TableCell>
              <TableCell>% Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map(stock => (
              <TableRow key={stock.stockSymbol}>
                <TableCell>{stock.stockSymbol}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>{stock.buyPrice}</TableCell>
                <TableCell>{stock.currentPrice}</TableCell>
                <TableCell
                  style={{color: stock.profitLoss >= 0 ? "green" : "red"}}
                >
                  {stock.profitLoss}
                </TableCell>
                <TableCell>{stock.profitLossPercentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom>
        Portfolio Performance
      </Typography>
      <Line data={chartData} />
    </Container>
  )
}

export default Portfolio
