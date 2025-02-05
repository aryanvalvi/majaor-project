import React, {useState} from "react"

const Test = () => {
  // State to store stock data and the search input
  const [stockData, setStockData] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [symbol, setSymbol] = useState("") // Stock symbol (e.g., "AAPL")
  const [quantity, setQuantity] = useState("") // Quantity of the stock
  const [buyPrice, setBuyPrice] = useState("") // Buy price per stock
  const [message, setMessage] = useState("")
  const handleSubmit = async e => {
    e.preventDefault()
    console.log("handle submit called ")

    // Validation: Check if the fields are not empty
    if (!symbol || !quantity || !buyPrice) {
      setMessage("Please fill in all fields.")
      return
    }

    const stockData = {
      symbol,
      quantity: parseInt(quantity), // Make sure quantity is a number
      buyPrice: parseFloat(buyPrice), // Convert buy price to a number
    }
    console.log(stockData)

    try {
      // Make the POST request
      // const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      const response = await fetch("http://localhost:5002/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockData), // Convert stockData to JSON string
      })

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json()
        setMessage(`Stock added to portfolio: ${data.portfolio}`)
      } else {
        const errorData = await response.json()
        setMessage(`Error: ${errorData.message}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }
  const fetchData = async ticker => {
    const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${ticker}`
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "2163e774demsha7b7f665d1d28e9p168c2ejsn99441c063973",
        "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
      },
    }

    try {
      const response = await fetch(url, options)
      const result = await response.json()
      setStockData(result) // Update state with stock data
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // Handle the form submission for the search
  const handleSearch = event => {
    event.preventDefault()
    fetchData(searchQuery)
  }
  const HandleLogin = () => {
    window.location.href = "http://localhost:5002/auth/google"
  }

  const test2 = async () => {
    const res = await fetch("http://localhost:5002/check", {
      method: "GET",
      credentials: "include",
    })
    const data = await res.json()
    console.log(data)
  }
  return (
    <div>
      <h2>Stock Search</h2>
      <form onSubmit={fetchData}>
        <input
          type="text"
          placeholder="Enter stock ticker (e.g., ADANIPORTS.BO)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {stockData ? (
          <div>
            <h3>Stock Information:</h3>
            <pre>{JSON.stringify(stockData, null, 2)}</pre>{" "}
            {/* Display stock data */}
          </div>
        ) : (
          <p>No data available. Please search for a stock symbol.</p>
        )}
      </div>
      <button onClick={HandleLogin}>Login</button>
      <div>
        <h2>Add Stock to Portfolio</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Stock Symbol:</label>
            <input
              type="text"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., AAPL)"
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label>Buy Price:</label>
            <input
              type="number"
              value={buyPrice}
              onChange={e => setBuyPrice(e.target.value)}
              placeholder="Enter buy price"
            />
          </div>
          <button type="submit">Add Stock</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <button onClick={test2}>CHECK</button>
    </div>
  )
}

export default Test
