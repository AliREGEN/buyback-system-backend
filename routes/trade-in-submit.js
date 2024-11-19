const express = require('express');
const router = express.Router();
const TradeInSubmission = require('../models/TradeInSubmission');
const got = require('got');

// Helper function to create a price rule
const createPriceRule = async (tradeInValue, productModel) => {
    try {
        const priceRuleEndpoint = `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-10/price_rules.json`;

        const priceRuleResponse = await got.post(priceRuleEndpoint, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_ACCESS_TOKEN}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            json: {
                price_rule: {
                    title: `Trade-In Discount - ${productModel}`,
                    target_type: 'line_item',
                    target_selection: 'all',
                    allocation_method: 'across',
                    value_type: 'fixed_amount',
                    value: `-${tradeInValue}`,
                    customer_selection: 'all',
                    starts_at: new Date().toISOString(),
                    usage_limit: 1,
                },
            },
            responseType: 'json',
        });

        return priceRuleResponse.body.price_rule.id; // Return the Price Rule ID
    } catch (error) {
        console.error('Error creating price rule (detailed):', {
            message: error.message,
            url: error.options?.url || 'Unknown URL',
            response: error.response?.body || error.response?.status,
            stack: error.stack,
        });
        throw new Error('Failed to create price rule');
    }
};

// Helper function to create a discount code
const createDiscountCode = async (priceRuleId) => {
    try {
        const discountCodeEndpoint = `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com/admin/api/2024-10/price_rules/${priceRuleId}/discount_codes.json`;

        const discountCode = `TRADEIN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        const discountCodeResponse = await got.post(discountCodeEndpoint, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_ACCESS_TOKEN}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            json: {
                discount_code: {
                    code: discountCode,
                },
            },
            responseType: 'json',
        });

        return discountCodeResponse.body.discount_code.code; // Return the Discount Code
    } catch (error) {
        console.error('Error creating discount code:', {
            message: error.message,
            url: error.options?.url || 'Unknown URL',
            response: error.response?.body || error.response?.status,
            stack: error.stack,
        });
        throw new Error('Failed to create discount code');
    }
};

router.get('/test-shopify', async (req, res) => {
    try {
        const response = await got.get('https://tnwqgc-rp.myshopify.com/admin/api/2024-10/shop.json', {
            headers: {
                 Authorization: `Basic ${Buffer.from(`${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_ACCESS_TOKEN}`).toString('base64')}`,
            },
            responseType: 'json',
        });

        res.json(response.body);
    } catch (error) {
        console.error('Shopify test error (detailed):', {
            message: error.message,
            url: error.options?.url || 'Unknown URL',
            response: error.response?.body || error.response?.status,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Shopify test failed', error: error.message });
    }
});

// Route to submit a trade-in
router.post('/trade-in-submit', async (req, res) => {
    const {
        tradeInValue,
        storageSize,
        functional,
        repaired,
        condition,
        ptaApproved,
        factoryUnlocked,
        accessories,
        productModel,
    } = req.body;

    try {
        // Validate required fields
        if (!tradeInValue || !productModel)
        {
            return res.status(400).json({ message: 'Trade-in value and product model are required' });
        }

        // Step 1: Create a price rule
        const priceRuleId = await createPriceRule(tradeInValue, productModel);

        // Step 2: Create a discount code
        const discountCode = await createDiscountCode(priceRuleId);

        // Step 3: Save trade-in data to the database
        const tradeInSubmission = new TradeInSubmission ({
            tradeInValue,
            productModel,
            storageSize,
            functional,
            repaired,
            condition,
            ptaApproved,
            factoryUnlocked,
            accessories,
            discountCode,
            createdAt: new Date(),
        });
        console.log('Trade-in submission:', tradeInSubmission);
        await tradeInSubmission.save();

        res.json({ discountCode });
    } catch (error) {
        console.error('Error submitting trade-in:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;