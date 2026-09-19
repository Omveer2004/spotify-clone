const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    if (err.name === 'MulterError') {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    res.status(500).json({
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
module.exports = app;
