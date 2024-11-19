require('dotenv').config();
const Shopify = require('shopify-api-node');

// replace these credentials with your actual Shopify store details
const shopify = new Shopify({
    shopName: process.env.SHOPIFY_STORE_URL,
    apiKey: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_ACCESS_TOKEN,
    apiVersion: '2024-10',
});

module.exports = shopify;