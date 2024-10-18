const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Enable GZIP compression
app.use(compression());

// Init Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/iphones', require('./routes/iphoneRoutes'));
app.use('/api/inspections', require('./routes/inspectionRoutes'));
app.use('/api/ipads', require('./routes/ipadRoutes'));
app.use('/api/samsung', require('./routes/samsungRoutes'));
app.use('/api/macbooks', require('./routes/macbookRoutes'));
app.use('/api/watches', require('./routes/watchRoutes'));
app.use('/api/presets', require('./routes/presetRoutes'));

// Newly added routes for options
app.use('/api/battery-health', require('./routes/batteryHealthRoutes'));
app.use('/api/activated-since', require('./routes/activatedSinceRoutes'));
app.use('/api/cosmetic-issues', require('./routes/cosmeticIssueRoutes'));
app.use('/api/processor-types', require('./routes/processorRoutes'));
app.use('/api/faults', require('./routes/faultRoutes'));
app.use('/api/repairs', require('./routes/repairRoutes'));
app.use('/api/front-screen', require('./routes/frontScreenRoutes'));
app.use('/api/back', require('./routes/backRoutes'));
app.use('/api/side', require('./routes/sideRoutes'));
app.use('/api/body', require('./routes/bodyRoutes'));
app.use('/api/sim-variant', require('./routes/simVariantRoutes'));
app.use('/api/pta', require('./routes/ptaRoutes'));
app.use('/api/accessories', require('./routes/accessoriesRoutes'));
app.use('/api/unknown-part', require('./routes/unknownPartOptionRoutes'));
app.use('/api/connectivity', require('./routes/connectivityRoutes'));
app.use('/api/apple-pencil', require('./routes/applePencilRoutes'));
app.use('/api/strap', require('./routes/strapRoutes'));
app.use('/api/band', require('./routes/bandRoutes'));
app.use('/api/device-count', require('./routes/deviceCountRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));