const express = require("express")
const router = express.Router()
const passport = require("passport")
const {
  addStock,
  getPortfolio,
  removeStock,
} = require("../controller/PortfolioController")
const {
  getPortfolioValue,
  getPortfolioo,
  addStocck,
} = require("../controller/yahoo")
router.get("/test", (req, res) => {
  res.json({Message: "Working"})
})

//auth login
router.get(
  "/auth/google",
  passport.authenticate("google", {scope: ["profile", "email"]})
)
//auth redirect
router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    // console.log(req.user);
    console.log("Authenticated:", req.user)
    res.redirect("http://localhost:5173")
  }
)

//auth getuserdata;
router.get("/getuserdata", (req, res) => {
  if (req.user) {
    res.status(200).json({
      user: req.user,
    })
    // console.log("bhadve", req.user);
  } else {
    res.json({user: null})
  }
})

//auth Logout
router.get("/auth/logout", (req, res) => {
  console.log("Logout is called ")
  req.logout(err => {
    if (err) {
      return res.send("Error while logout")
    }
    req.session.destroy(err => {
      if (err) {
        console.log("Error destryoing session", err)
      }
      res.clearCookie("connect.sid"),
        // res.redirect("http://localhost:3000")
        res.json({message: "logged out be"})
      console.log("Logged Out Successfully")
    })
  })
})
const authMiddleware = (req, res, next) => {
  if (req.user) {
    next()
  }
}

router.post("/add", addStock) // Add stock to portfolio
router.get("/", authMiddleware, getPortfolio) // Get portfolio
router.delete("/remove", authMiddleware, removeStock)
router.get("/check", (req, res) => {
  if (req.user) {
    res.json({user: req.user})
  } else {
    res.json({user: null})
  }
})

router.post("/addStock", addStocck)
router.get("/getuserportfolio", getPortfolioo)
module.exports = router
