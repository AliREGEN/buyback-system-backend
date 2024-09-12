// middleware/apiKeyMiddleware.js

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey && apiKey === process.env.API_KEY) {
    next(); // Proceed if the API key is valid
  } else {
    res.status(403).json({ message: 'Forbidden - Invalid API Key' });
  }
};

module.exports = apiKeyMiddleware;
