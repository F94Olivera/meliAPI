const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./models/db');
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config();
const app = express();

// Connect Database
connectDB();

app.use(cookieParser());
app.use(express.json());
// Check this
app.use(express.urlencoded({ extended: true }));

// Add middleware
app.get('/', (req, res) => res.send('API running'));
app.use('/api/login', require('./routes/login'));
app.use(authMiddleware.authorize);

// Routes
app.use('/api/shows', require('./routes/shows'));
app.use('/api/reservations', require('./routes/reservations'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
app.use(express.urlencoded({ extended: true }));
