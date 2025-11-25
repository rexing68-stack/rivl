require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    'https://rivl.club',
    'https://www.rivl.club',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, '..', 'frontend')));

console.log('Supabase URL:', process.env.SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Loaded' : 'Missing');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/payments', require('./routes/payments'));

app.get('/api/config', (req, res) => {
    res.json({
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
    });
});

// Catch-all removed temporarily to fix Express 5 compatibility issue
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
// });

app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
