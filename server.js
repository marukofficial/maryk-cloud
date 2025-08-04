require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const SHOP_URL = process.env.SHOP_URL;
const API_TOKEN = process.env.API_TOKEN;
const API_VERSION = process.env.API_VERSION || "2024-01";

// Endpoint exemple : MAJ description produit
app.post('/api/update-description', async (req, res) => {
  try {
    const { handle, new_description } = req.body;
    const search_url = `${SHOP_URL}/admin/api/${API_VERSION}/products.json?handle=${handle}`;
    const headers = {
      "X-Shopify-Access-Token": API_TOKEN,
      "Content-Type": "application/json"
    };
    const response = await axios.get(search_url, { headers });
    const products = response.data.products || [];
    if (!products.length) return res.status(404).json({ error: `Produit non trouvé: ${handle}` });
    const product_id = products[0].id;
    const update_url = `${SHOP_URL}/admin/api/${API_VERSION}/products/${product_id}.json`;
    const payload = { product: { id: product_id, body_html: new_description } };
    const update_response = await axios.put(update_url, payload, { headers });
    if (update_response.status === 200) {
      return res.json({ success: true, handle });
    } else {
      return res.status(500).json({ error: "Erreur MAJ", details: update_response.data });
    }
  } catch (e) {
    return res.status(500).json({ error: "Erreur serveur", details: e.message });
  }
});

// Health check
app.get('/', (req, res) => res.send('MaryK Cloud API OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaryK Cloud API lancé sur le port ${PORT}`);
});
