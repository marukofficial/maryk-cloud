// ✅ MaryK Cloud API Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Shopify creds (depuis .env)
const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SHOPIFY_ADMIN_API_TOKEN,
  SHOPIFY_STORE_URL,
  SHOPIFY_API_VERSION
} = process.env;

// Test public route
app.get('/api/test', (req, res) => {
  res.json({ status: 'MaryK Cloud API OK', store: SHOPIFY_STORE_URL, server: process.env.API_URL });
});

// Example: Get Shopify shop info
app.get('/api/shop-info', async (req, res) => {
  try {
    const shop = await axios.get(
      `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(shop.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- (ajoute ici les autres endpoints custom) ---

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaryK Cloud API is running on port ${PORT}`);
});

