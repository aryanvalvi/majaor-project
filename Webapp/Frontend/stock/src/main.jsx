import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import Home from "./Home.jsx"
import Rapid from "./Rapid.jsx"
import Portfolio from "./Portfolio.jsx"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Test from "./Test.jsx"
import {CounterProvider} from "./context/Usercontext.jsx"
import ProtectedRoute from "./customHook/ProtectedRoute.jsx"
import Navbar from "./Navbar.jsx"
import TradingViewLiveChart from "./TradingChart.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CounterProvider>
      <Router>
        {/* <Home></Home> */}
        {/* <App /> */}
        {/* <Rapid></Rapid> */}
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route path="/test" element={<Test />} />
          <Route path="/prediction" element={<App />} />
          <Route path="/live" element={<TradingViewLiveChart />} />
        </Routes>
      </Router>
    </CounterProvider>
  </StrictMode>
)
