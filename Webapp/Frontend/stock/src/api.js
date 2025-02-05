const API_URL = "http://localhost:5002"

export const addStock = async stockData => {
  return fetch(`${API_URL}/addstock`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(stockData),
  }).then(res => res.json())
}

export const getPortfolio = async () => {
  return fetch(`${API_URL}/getuserportfolio`).then(res => res.json())
}
