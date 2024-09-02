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
// app.use('/api/repairs', require('./routes/repairRoutes'));
// app.use('/api/battery-health', require('./routes/batteryHealthRoutes'));
// app.use('/api/front-screen', require('./routes/frontScreenRoutes'));
// app.use('/api/back', require('./routes/backRoutes'));
// app.use('/api/side', require('./routes/sideRoutes'));
// app.use('/api/pta', require('./routes/ptaRoutes'));
// app.use('/api/accessories', require('./routes/accessoriesRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inspections', require('./routes/inspectionRoutes'));
// app.use('/api/faults', require('./routes/faultRoutes'));
// app.use('/api/sim-variants', require('./routes/simVariantRoutes'));
// app.use('/api/cosmetic-issues', require('./routes/cosmeticIssuesRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));