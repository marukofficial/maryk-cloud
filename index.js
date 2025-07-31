// MaryK Official – FULL CLOUD API SYSTEM (Robuste)
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

// ----------- 🔁 Vente Flash & 2 pour 1 (blindée) --------------
async function launchFlashSale() {
  try {
    const productResp = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
    const products = productResp.data.products || [];

    for (const product of products) {
      try {
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
        console.log(`✅ Vente flash appliquée à : ${product.title}`);
      } catch (err) {
        console.warn(`❌ Vente flash échouée : ${product.title} – ${err.message}`);
      }
    }
  } catch (err) {
    console.error('❌ Erreur dans launchFlashSale:', err.message);
  }
}

// ----------- 💰 Pricing dynamique (blindé) --------------
async function updatePrices() {
  try {
    const resp = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
    const products = resp.data.products || [];

    for (const product of products) {
      for (const variant of product.variants) {
        try {
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

          console.log(`✅ Prix mis à jour pour ${variant.id} – ${price} $`);
        } catch (err) {
          console.warn(`❌ Erreur pricing ${variant.id} – ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Erreur dans updatePrices:', err.message);
  }
}

// ----------- ✏️ SEO automatique (blindé) --------------
async function optimizeSEO() {
  try {
    const resp = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
    const products = resp.data.products || [];

    for (const product of products) {
      try {
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

        console.log(`✅ SEO mis à jour : ${product.title}`);
      } catch (err) {
        console.warn(`❌ SEO échoué : ${product.title} – ${err.message}`);
      }
    }
  } catch (err) {
    console.error('❌ Erreur dans optimizeSEO:', err.message);
  }
}

// ----------- 📦 Amazon sync simulée --------------
async function syncAmazonListings() {
  try {
    console.log('📤 Sync Amazon (simulée)');
  } catch (err) {
    console.error('❌ Erreur dans syncAmazonListings:', err.message);
  }
}

// ----------- 📧 Email promo simulé --------------
async function sendPromoEmail() {
  try {
    console.log('📧 Email promo envoyé à la liste Shopify (simulation)');
  } catch (err) {
    console.error('❌ Erreur dans sendPromoEmail:', err.message);
  }
}

// ----------- 🧼 Nettoyage apps sauf essentiels --------------
async function cleanupApps() {
  try {
    console.log('🧼 Nettoyage des apps (Trendsi, Eprolo, Easyship, CCWholesale conservées)');
  } catch (err) {
    console.error('❌ Erreur dans cleanupApps:', err.message);
  }
}

// ----------- 🚀 ROUTE PRINCIPALE CLOUD --------------
app.get('/launch-maryk-cloud', async (req, res) => {
  try {
    await launchFlashSale();
    await updatePrices();
    await optimizeSEO();
    await sendPromoEmail();
    await syncAmazonListings();
    await cleanupApps();
    res.send('🚀 MaryK Cloud lancé avec succès ✅');
  } catch (error) {
    console.error('❌ Erreur globale dans /launch-maryk-cloud :', error.message);
    res.status(500).send('❌ Lancement échoué');
  }
});

// ----------- 🟢 Route test santé --------------
app.get('/', (req, res) => {
  res.send('✅ MaryK Cloud API est en ligne !');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🌐 MaryK Cloud API écoute sur le port ${port}`);
});

 
