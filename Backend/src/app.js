const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://spotify-clone-omveer.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error("Error:", err);

    if (err.name === 'MulterError') {
        return res.status(400).json({
            message: `Upload error: ${err.message}`
        });
    }

    res.status(500).json({
        message: 'Server error',
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : undefined
    });
});

module.exports = app;