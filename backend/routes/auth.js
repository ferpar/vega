const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const refreshTokens = [];

const users = [{ id: 1, username: "test", password: bcrypt.hashSync("password", 10) }];

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "60m" });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
    refreshTokens.push(refreshToken);
    return refreshToken;
};

// Login Route
router.post("/login", (req, res) => {
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
        // sameSite: "none",
        path: "/refresh",
    });

    res.json({ accessToken });
});

// Token Refresh Route
router.post("/refresh", (req, res) => {
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

// Register Route
router.post("/register", (req, res) => {
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
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", { path: "/refresh" });
    // remove refresh token from storage (no reassignment)
    refreshTokens.splice(refreshTokens.indexOf(req.cookies.refreshToken), 1);
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
