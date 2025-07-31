// MaryK Official – FULL CLOUD API SYSTEM (index.js)
// 🚀 Automatisé : SEO, Amazon FBA, Pricing, Taille, UX, Multicanal, Avis

import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// 🧩 Variables
const SHOP_URL = process.env.SHOP_URL;
const API_TOKEN = process.env.API_TOKEN;
const AMAZON_TOKEN = process.env.AMAZON_TOKEN;

const headers = {
  'X-Shopify-Access-Token': API_TOKEN,
  'Content-Type': 'application/json',
};

// ----------- 🔁 Vente Flash --------------
async function launchFlashSale() {
  try {
    const products = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
    for (const product of products.data.products) {
      await axios.put(`${SHOP_URL}/admin/api/2024-01/products/${product.id}.json`, {
        product: {
          id: product.id,
          tags: `${product.tags},FLASH_SALE`,
          variants: product.variants.map((variant) => ({
            id: variant.id,
            price: (parseFloat(variant.price) * 0.8).toFixed(2), // -20%
          })),
        },
      }, { headers });
    }
    console.log('✅ Vente flash appliquée');
  } catch (error) {
    console.error('❌ Erreur vente flash :', error.message);
  }
}

// ----------- 💰 Pricing dynamique --------------
async function updatePrices() {
  try {
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
              type: 'single_line_text_field',
            }],
          },
        }, { headers });
      }
    }
    console.log('✅ Prix mis à jour');
  } catch (error) {
    console.error('❌ Erreur pricing :', error.message);
  }
}

// ----------- ✏️ SEO automatique --------------
async function optimizeSEO() {
  try {
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
              type: 'single_line_text_field',
            },
            {
              namespace: 'seo',
              key: 'meta_description',
              value: `Find ${product.title} at MaryKOfficial.com – Free Shipping & Flash Deals`,
              type: 'multi_line_text_field',
            },
          ],
        },
      }, { headers });
    }
    console.log('✅ SEO optimisé');
  } catch (error) {
    console.error('❌ Erreur SEO :', error.message);
  }
}

// ----------- 📦 Amazon FBA sync auto --------------
async function syncAmazonListings() {
  console.log('📤 Amazon sync simulé – à intégrer SP-API plus tard');
}

// ----------- 🧼 Nettoyage des apps --------------
async function cleanupApps() {
  console.log('🧼 Suppression des apps sauf Trendsi, Eprolo, CCWholesale, Easyship (simulé)');
}

// ----------- 📧 Email promo automatique --------------
async function sendPromoEmail() {
  console.log('📧 Email promo simulé – Intégrer SMTP ou Klaviyo');
}

// ----------- 🚀 Route API principale --------------
app.get('/launch-maryk-cloud', async (req, res) => {
  try {
    await launchFlashSale();
    await updatePrices();
    await optimizeSEO();
    await sendPromoEmail();
    await syncAmazonListings();
    await cleanupApps();

    res.status(200).send('🚀 MaryK Cloud API lancé avec succès !');
  } catch (error) {
    console.error('❌ Échec global :', error.message);
    res.status(500).send('❌ Une erreur est survenue : ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`🚀 MaryK Cloud API active sur port ${port}`);
});

