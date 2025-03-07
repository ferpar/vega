require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { assetsFn, pricesFn, portfoliosFn } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL, // Adjust for your frontend
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const users = [{ id: 1, username: "test", password: bcrypt.hashSync("password", 10) }];

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const refreshTokens = [];

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "6000" });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
    refreshTokens.push(refreshToken);
    return refreshToken;
};

// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // Ensure it's sent only over HTTPS
        sameSite: "strict",
        path: "/refresh",
    });

    res.json({ accessToken });
});

// Token Refresh Route
app.post("/refresh", (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token || !refreshTokens.includes(token)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        const newAccessToken = generateAccessToken({ id: user.id, username: user.username });
        res.json({ accessToken: newAccessToken });
    });
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
        id: users.length + 1,
        username,
        password: bcrypt.hashSync(password, 10)
    };

    users.push(newUser);
    res.json({ message: "User created successfully" });
});

// Logout Route
app.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", { path: "/refresh" });
    // remove refresh token from storage (no reassignment)
    refreshTokens.splice(refreshTokens.indexOf(req.cookies.refreshToken), 1);
    res.json({ message: "Logged out successfully" });
});

// Protected Route Example
app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected data", user: req.user });
});

app.get("/assets", authenticateToken, (req, res) => {
    res.json(assetsFn())
})

// query params: /prices?assets=AAPL,GOOGL&asOf=2021-08-01
app.get("/prices", authenticateToken, (req, res) => {
    const assets = req.query.assets ? req.query.assets.split(",") : null;
    const prices = pricesFn()

    const filteredPrices = !assets ? prices : prices.filter(p => assets.includes(p.asset));

    res.json(filteredPrices)
})

// query params: /positions?asOf=2021-08-01
app.get("/portfolios", authenticateToken, (req, res) => {
    const asOf = req.query.asOf ? req.query.asOf.split(",") : ['2021-08-01']
    const portfolio = portfoliosFn(asOf)

    res.json(portfolio)
})

// Middleware to Verify Access Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});