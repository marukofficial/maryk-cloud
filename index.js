// ✅ server.js – MaryK Cloud API Backend (Express)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ➕ Exemple de route pour test
app.get('/api/test-product', (req, res) => {
  res.status(200).json({ message: "✅ Route /api/test-product is working." });
});

// ➕ Exemple de route pour Shopify info
app.get('/api/shop-info', async (req, res) => {
  try {
    const axios = require('axios');

    const response = await axios.get(`${process.env.SHOP_URL}/admin/api/${process.env.API_VERSION}/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': process.env.API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Shopify API Error', details: err.message });
  }
});

// ✅ Démarrer le serveur sur Railway ou local
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 MaryK Cloud API running on port ${PORT}`);
});
