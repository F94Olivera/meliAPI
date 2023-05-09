const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./models/db');

dotenv.config();
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
// Check this
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('API running'));

// // Routes
// app.use('/api/shows', require('./routes/shows'));
// app.use('/api/reservations', require('./routes/reservations'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
app.use(express.urlencoded({ extended: true }));
