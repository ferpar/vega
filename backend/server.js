require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL, // Adjust for your frontend
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});