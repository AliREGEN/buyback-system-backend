const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/iphones', require('./routes/iphoneRoutes'));
app.use('/api/inspections', require('./routes/inspectionRoutes'));
app.use('/api/ipads', require('./routes/ipadRoutes'));
app.use('/api/samsung', require('./routes/samsungRoutes'));
app.use('/api/macbooks', require('./routes/macbookRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));