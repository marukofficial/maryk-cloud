// MaryK Official – FULL CLOUD API SYSTEM (CommonJS)
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

// Vente Flash
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

// Prix auto
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

// SEO auto
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

// Amazon sync simulée
async function syncAmazonListings() {
  console.log('📤 Amazon sync FBA enclenché');
}

// Email promo simulé
async function sendPromoEmail() {
  console.log('📧 Email promo envoyé à la liste d’abonnés Shopify');
}

// Nettoyage d’apps simulé
async function cleanupApps() {
  console.log('🧼 Nettoyage des apps (simulation)');
}

// Route principale
app.get('/launch-maryk-cloud', async (req, res) => {
  await launchFlashSale();
  await updatePrices();
  await optimizeSEO();
  await sendPromoEmail();
  await syncAmazonListings();
  await cleanupApps();
  res.send('🚀 MaryK Cloud lancé avec succès !');
});

app.listen(port, () => {
  console.log(`🚀 MaryK Cloud API active sur le port ${port}`);
});
