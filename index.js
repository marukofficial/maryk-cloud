require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

// Middleware : logging des requêtes HTTP
app.use(morgan('combined'));

// Middleware : CORS configuré (tu peux limiter les origines si besoin)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware : parser JSON avec limite de taille (sécurité)
app.use(express.json({ limit: '10kb' }));

// Middleware : simple whitelist IP (optionnel)
if (process.env.WHITELIST_IPS) {
  const whitelist = process.env.WHITELIST_IPS.split(',');
  app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (whitelist.includes(ip)) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  });
}

// Route test simple
app.get('/api/test-product', (req, res) => {
  res.status(200).json({ message: "✅ Route /api/test-product is working." });
});

// Route pour récupérer les infos Shopify
app.get('/api/shop-info', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.SHOP_URL}/admin/api/${process.env.API_VERSION}/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': process.env.API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Shopify shop info:', error.message);
    res.status(500).json({ error: 'Failed to fetch Shopify shop info' });
  }
});

// Endpoint mise à jour description produit avec validation
app.post('/api/update-description', async (req, res) => {
  try {
    const { handle, new_description } = req.body;

    if (!handle || !new_description) {
      return res.status(400).json({ error: 'Missing required fields: handle and new_description' });
    }

    const search_url = `${process.env.SHOP_URL}/admin/api/${process.env.API_VERSION}/products.json?handle=${handle}`;
    const headers = {
      "X-Shopify-Access-Token": process.env.API_TOKEN,
      "Content-Type": "application/json"
    };

    // Recherche du produit
    const response = await axios.get(search_url, { headers, timeout: 7000 });
    const products = response.data.products || [];
    if (!products.length) {
      return res.status(404).json({ error: `Produit non trouvé: ${handle}` });
    }

    const product_id = products[0].id;
    const update_url = `${process.env.SHOP_URL}/admin/api/${process.env.API_VERSION}/products/${product_id}.json`;
    const payload = { product: { id: product_id, body_html: new_description } };

    // Mise à jour description
    const update_response = await axios.put(update_url, payload, { headers, timeout: 7000 });
    if (update_response.status === 200) {
      res.json({ success: true, handle });
    } else {
      res.status(500).json({ error: "Erreur mise à jour", details: update_response.data });
    }
  } catch (e) {
    console.error('Error in update-description:', e.message);
    res.status(500).json({ error: "Erreur serveur", details: e.message });
  }
});

// Health check racine
app.get('/', (req, res) => res.send('MaryK Cloud API OK'));

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Gestion des erreurs globales (middleware)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaryK Cloud API lancé sur le port ${PORT}`);
});
cron.schedule('0 2 * * *', () => {
  console.log('Début de la tâche cron : mise à jour automatique des prix');
  updatePrices()
    .then(() => console.log('Mise à jour des prix terminée'))
    .catch(err => console.error('Erreur lors de la mise à jour des prix', err));
});
