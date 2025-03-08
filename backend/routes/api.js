const jwt = require('jsonwebtoken');
const express = require('express');
const { assetsFn, pricesFn, portfoliosFn } = require('../db');
const router = express.Router();

// Middleware to Verify Access Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

// Protected Route Example
router.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected data", user: req.user });
});

router.get("/assets", authenticateToken, (req, res) => {
    res.json(assetsFn())
})

// query params: /prices?assets=AAPL,GOOGL&asOf=2021-08-01
router.get("/prices", authenticateToken, (req, res) => {
    const assets = req.query.assets ? req.query.assets.split(",") : null;
    const prices = pricesFn()

    const filteredPrices = !assets ? prices : prices.filter(p => assets.includes(p.asset));

    res.json(filteredPrices)
})

// query params: /positions?asOf=2021-08-01
router.get("/portfolios", authenticateToken, (req, res) => {
    const asOf = req.query.asOf ? req.query.asOf.split(",") : ['2021-08-01']
    const portfolio = portfoliosFn(asOf)

    res.json(portfolio)
})

module.exports = router;
