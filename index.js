require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const cron = require('node-cron');

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Route test simple
app.get('/api/test-product', (req, res) => {
  res.status(200).json({ message: "✅ Route /api/test-product is working." });
});

// Route pour récupérer infos Shopify
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

// Route mise à jour description produit
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

    const response = await axios.get(search_url, { headers, timeout: 7000 });
    const products = response.data.products || [];
    if (!products.length) {
      return res.status(404).json({ error: `Produit non trouvé: ${handle}` });
    }

    const product_id = products[0].id;
    const update_url = `${process.env.SHOP_URL}/admin/api/${process.env.API_VERSION}/products/${product_id}.json`;
    const payload = { product: { id: product_id, body_html: new_description } };

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

// Fonction mise à jour automatique des prix selon grille
async function updatePrices() {
  try {
    const calculPrixFinal = (cost) => {
      if (cost <= 5) return cost + 7 + 10;
      else if (cost <= 10) return cost + 8 + 9;
      else if (cost <= 15) return cost + 8 + 8;
      else if (cost <= 20) return cost + 9 + 7;
      else if (cost <= 25) return cost + 9 + 6;
      else if (cost <= 30) return cost + 10 + 5;
      else if (cost <= 40) return cost + 10 + 4;
      else if (cost <= 50) return cost + 12 + 4;
      else if (cost <= 60) return cost + 13 + 3;
      else if (cost <= 80) return cost + 14 + 3;
      else return cost + 16 + 2;
    };

    const headers = {
      "X-Shopify-Access-Token": process.env.API_TOKEN,
      "Content-Type": "application/json"
    };

    const url = `${process.env.SHOP_URL}/admin/api/${process.env.API_VERSION}/products.json`;

    const response = await axios.get(url, { headers });
    const products = response.data.products || [];

    for (const product of products) {
      for (const variant of product.variants) {
        let cost = parseFloat(variant.cost) || 0;
        let newPrice = calculPrixFinal(cost);
        newPrice = Math.round(newPrice * 100) / 100;

        const updateUrl = `${process.env.SHOP_URL}/admin/api/${process.env.API_VERSION}/variants/${variant.id}.json`;
        const payload = {
          variant: {
            id: variant.id,
            price: newPrice.toString()
          }
        };

        const updateResponse = await axios.put(updateUrl, payload, { headers });
        if (updateResponse.status !== 200) {
          console.error(`Erreur mise à jour variante ${variant.id}:`, updateResponse.data);
        }
      }
    }

    console.log("Mise à jour des prix terminée.");

  } catch (error) {
    console.error('Erreur dans updatePrices:', error.message);
  }
}

// Endpoint pour lancer la mise à jour prix manuellement via API
app.post('/api/update-prices', async (req, res) => {
  try {
    await updatePrices();
    res.json({ success: true, message: "Prix mis à jour selon la grille." });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Planification cron à 2h du matin UTC
cron.schedule('0 2 * * *', () => {
  console.log('Début de la tâche cron : mise à jour automatique des prix');
  updatePrices()
    .then(() => console.log('Mise à jour des prix terminée'))
    .catch(err => console.error('Erreur lors de la mise à jour des prix', err));
});

// Optionnel : lance une mise à jour au démarrage
updatePrices();

// Health check racine
app.get('/', (req, res) => res.send('MaryK Cloud API OK'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Gestion erreurs globales
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaryK Cloud API lancé sur le port ${PORT}`);
});
