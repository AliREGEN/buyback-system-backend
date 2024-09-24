const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const zlib = require('zlib'); // For Brotli and GZIP compression
const stream = require('stream');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware to handle Brotli and GZIP compression
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';

  // Only compress the response if it is not already being compressed
  if (res.getHeader('Content-Encoding')) {
    return next();
  }

  // Check for Brotli support first
  if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
    const brotli = zlib.createBrotliCompress();
    const passThrough = new stream.PassThrough(); // A stream to pass the response data
    stream.pipeline(res, brotli, passThrough, (err) => {
      if (err) {
        next(err);
      }
    });
    res.write = (chunk) => passThrough.write(chunk);
    res.end = () => passThrough.end();
  }
  // Fall back to GZIP support if Brotli is not available
  else if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const gzip = zlib.createGzip();
    const passThrough = new stream.PassThrough();
    stream.pipeline(res, gzip, passThrough, (err) => {
      if (err) {
        next(err);
      }
    });
    res.write = (chunk) => passThrough.write(chunk);
    res.end = () => passThrough.end();
  } else {
    next();
  }
});

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
app.use('/api/iphone-presets', require('./routes/iphonePresetRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
