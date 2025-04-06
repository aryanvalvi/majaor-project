const express = require("express")
const router = express.Router()
const passport = require("passport")

// Import from a single controller file to avoid confusion
const portfolioController = require("../controller/PortfolioController")
const yahooController = require("../controller/yahoo") // Make sure path is correct

// Test route
router.get("/test", (req, res) => {
  res.json({Message: "Working"})
})

// Auth routes
router.get(
  "/auth/google",
  passport.authenticate("google", {scope: ["profile", "email"]})
)

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {failureRedirect: "/"}),
  (req, res) => {
    res.redirect("http://localhost:5173")
  }
)

// User routes
router.get("/getuserdata", (req, res) => {
  res.json({user: req.user || null})
})

router.get("/auth/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid")
      res.json({message: "Logged out successfully"})
    })
  })
})

// Auth middleware
const authMiddleware = (req, res, next) => {
  req.user ? next() : res.status(401).json({message: "Unauthorized"})
}

// Portfolio routes
router.post("/add", authMiddleware, portfolioController.addStock)
router.get("/", authMiddleware, portfolioController.getPortfolio)
router.delete("/remove", authMiddleware, portfolioController.removeStock)

// Yahoo finance routes
router.post("/addStock", authMiddleware, yahooController.addStocck) // Fixed
router.get("/getuserportfolio", authMiddleware, yahooController.getPortfolioo)

// Auth check
router.get("/check", (req, res) => {
  res.json({user: req.user || null})
})

module.exports = router
