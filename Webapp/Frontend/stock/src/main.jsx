import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Home from "./Home.jsx";
import Rapid from "./Rapid.jsx";
import Portfolio from "./Portfolio.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Home></Home>
      <App />
      <Rapid></Rapid>
      <Routes>
        <Route path="/" element={<Rapid />}></Route>
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
  </StrictMode>
);
