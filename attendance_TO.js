// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const checkRoutes = require('./routes/checkInOut');
const de = require('./default_setup');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// Connect to MongoDB
connectDB();

// Routes
app.use('/', authRoutes);
app.use('/', checkRoutes);
app.use('/auth/setup', de);

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
