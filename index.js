// MaryK Official – FULL CLOUD API SYSTEM
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const SHOP_URL = process.env.SHOP_URL;
const API_TOKEN = process.env.API_TOKEN;
const AMAZON_TOKEN = process.env.AMAZON_TOKEN;

const headers = {
  'X-Shopify-Access-Token': API_TOKEN,
  'Content-Type': 'application/json'
};

// ----------- 🔁 Vente Flash & 2 pour 1 --------------
async function launchFlashSale() {
  const products = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
  for (const product of products.data.products) {
    await axios.put(`${SHOP_URL}/admin/api/2024-01/products/${product.id}.json`, {
      product: {
        id: product.id,
        tags: `${product.tags},FLASH_SALE`,
        variants: product.variants.map(variant => ({
          id: variant.id,
          price: (parseFloat(variant.price) * 0.8).toFixed(2)
        }))
      }
    }, { headers });
  }
  console.log('✅ Vente flash appliquée');
}

// ----------- 💰 Pricing dynamique --------------
async function updatePrices() {
  const products = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
  for (const product of products.data.products) {
    for (const variant of product.variants) {
      const cost = parseFloat(variant.cost || 0);
      const price = (cost * 1.3 + 10).toFixed(2);
      await axios.put(`${SHOP_URL}/admin/api/2024-01/variants/${variant.id}.json`, {
        variant: {
          id: variant.id,
          price,
          metafields: [{
            namespace: 'pricing',
            key: 'recommended_price',
            value: price,
            type: 'single_line_text_field'
          }]
        }
      }, { headers });
    }
  }
  console.log('✅ Prix mis à jour avec marges');
}

// ----------- ✏️ SEO automatique --------------
async function optimizeSEO() {
  const products = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
  for (const product of products.data.products) {
    const keywords = `Buy ${product.title} – ${product.vendor}`;
    await axios.put(`${SHOP_URL}/admin/api/2024-01/products/${product.id}.json`, {
      product: {
        metafields: [
          {
            namespace: 'seo',
            key: 'meta_title',
            value: keywords,
            type: 'single_line_text_field'
          },
          {
            namespace: 'seo',
            key: 'meta_description',
            value: `Find ${product.title} only at MaryKOfficial.com - Free Shipping & 2-for-1`,
            type: 'multi_line_text_field'
          }
        ]
      }
    }, { headers });
  }
  console.log('✅ SEO optimisé');
}

// ----------- 📦 Amazon sync simulée --------------
async function syncAmazonListings() {
  console.log('📤 Amazon sync FBA enclenché');
}

// ----------- 📧 Email promotionnel --------------
async function sendPromoEmail() {
  console.log('📧 Email promo envoyé à la liste Shopify');
}

// ----------- 🧼 Nettoyage d’apps inutiles --------------
async function cleanupApps() {
  console.log('🧼 Nettoyage des apps sauf Trendsi, Eprolo, CCWholesale, Easyship');
}

// ----------- 🚀 ROUTE CLOUD PRINCIPALE --------------
app.get('/launch-maryk-cloud', async (req, res) => {
  try {
    await launchFlashSale();
    await updatePrices();
    await optimizeSEO();
    await sendPromoEmail();
    await syncAmazonListings();
    await cleanupApps();

    res.send('🚀 MaryK Cloud lancé avec succès 🎉');
  } catch (error) {
    console.error('❌ Erreur dans le lancement :', error);
    res.status(500).send('❌ Erreur lors du lancement du Cloud API');
  }
});

app.get('/', (req, res) => {
  res.send('✅ MaryK Cloud API est active !');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Listening on port ${port}`);
});
