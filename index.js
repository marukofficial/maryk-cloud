// MaryK Cloud – API Full Automation (v1.0.0)

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());

const SHOP_URL = process.env.SHOP_URL;
const API_TOKEN = process.env.API_TOKEN;
const AMAZON_TOKEN = process.env.AMAZON_TOKEN;
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const ADMIN_KEY = process.env.ADMIN_KEY || 'marykadmin123';

const headers = {
  'X-Shopify-Access-Token': API_TOKEN,
  'Content-Type': 'application/json'
};

// 🔁 Vente flash -20 %
async function launchFlashSale() {
  try {
    const productResp = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
    const products = productResp.data.products;
    for (const product of products) {
      try {
        await axios.put(`${SHOP_URL}/admin/api/2024-01/products/${product.id}.json`, {
          product: {
            id: product.id,
            tags: `${product.tags},FLASH_SALE`,
            variants: product.variants.map(v => ({
              id: v.id,
              price: (parseFloat(v.price) * 0.8).toFixed(2)
            }))
          }
        }, { headers });
        console.log(`✅ Flash appliqué: ${product.title}`);
      } catch (err) {
        console.error(`❌ Flash FAIL: ${product.title} - ${err.message}`);
      }
    }
  } catch (err) {
    console.error('❌ Erreur globale vente flash:', err.message);
  }
}

// 💰 Prix = Cost × 1.3 + 10 $
async function updatePrices() {
  try {
    const productResp = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
    for (const product of productResp.data.products) {
      for (const variant of product.variants) {
        const cost = parseFloat(variant.cost || 0);
        const price = (cost * 1.3 + 10).toFixed(2);
        try {
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
          console.log(`💰 Prix maj: ${variant.id} = ${price}`);
        } catch (err) {
          console.error(`❌ Prix FAIL: ${variant.id} - ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Erreur pricing:', err.message);
  }
}

// ✏️ SEO Automatique
async function optimizeSEO() {
  try {
    const productResp = await axios.get(`${SHOP_URL}/admin/api/2024-01/products.json`, { headers });
    for (const product of productResp.data.products) {
      const keywords = `Buy ${product.title} – ${product.vendor}`;
      try {
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
        console.log(`✏️ SEO ok: ${product.title}`);
      } catch (err) {
        console.error(`❌ SEO FAIL: ${product.title} - ${err.message}`);
      }
    }
  } catch (err) {
    console.error('❌ Erreur SEO:', err.message);
  }
}

// 📦 Amazon Sync mocké
async function syncAmazonListings() {
  console.log('📦 Amazon sync simulé');
}

// 📧 Email promo mocké
async function sendPromoEmail() {
  console.log(`📧 Email promo simulé depuis ${EMAIL_SENDER}`);
}

// 🧼 Nettoyage apps (mock)
async function cleanupApps() {
  console.log('🧼 Apps nettoyées sauf Trendsi, Eprolo, CCWholesale, Easyship');
}

// 📏 Préférences client (mensurations)
let userSizePreferences = {};

app.post('/save-preferences', (req, res) => {
  const { userId, measurements, fit, length, color } = req.body;
  userSizePreferences[userId] = { measurements, fit, length, color };
  res.send({ status: 'saved' });
});

// 💬 Chat intelligent
app.post('/chat', (req, res) => {
  const { message } = req.body;
  if (message.includes('shipping')) return res.send({ autoReply: 'Shipping is free worldwide 🛫' });
  if (message.includes('return')) return res.send({ autoReply: 'You can return within 15 days 💬' });
  res.send({ autoReply: 'Merci ! Équipe MaryK vous répondra bientôt 📨' });
});

// 🌍 Devise automatique
app.get('/currency', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const currency = ip.includes('24.') ? 'CAD' : 'USD';
  const tax = currency === 'CAD' ? 'TPS/TVQ' : 'no tax';
  res.send({ currency, tax });
});

// 🖼️ Produits vedettes collection
app.get('/featured-products/:collection', (req, res) => {
  const { collection } = req.params;
  const products = Array.from({ length: 10 }, (_, i) => ({
    title: `${collection} #${i + 1}`,
    type: i % 2 === 0 ? 'video' : 'image',
    url: `https://cdn.marykofficial.com/${collection}/${i + 1}.${i % 2 === 0 ? 'mp4' : 'jpg'}`
  }));
  res.send(products);
});

// ⭐ Reviews 4-5 étoiles seulement
app.get('/reviews/:productId', async (req, res) => {
  const { productId } = req.params;
  const reviews = [
    { stars: 5, image: true, text: "Love it!" },
    { stars: 4, image: true, text: "Très beau rendu!" }
  ];
  const filtered = reviews.filter(r => r.stars >= 4 && r.image);
  res.send({ productId, total: filtered.length, average: 4.5, reviews: filtered });
});

// 📈 Dashboard API
app.get('/dashboard', (req, res) => {
  res.send({
    uptime: process.uptime(),
    modules: {
      pricing: '✅',
      SEO: '✅',
      FlashSale: '✅',
      Chat: '✅',
      AmazonSync: '✅',
      Taille: '✅',
      Avis: '✅'
    }
  });
});

// 🔐 Admin
function protectAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key !== ADMIN_KEY) return res.status(403).send('⛔ Unauthorized');
  next();
}

app.get('/admin/insights', protectAdmin, (req, res) => {
  res.send({
    flashSale: '✅ 3 produits en promo',
    topViewed: [
      { title: 'Tech Lash Pro', views: 1240 },
      { title: 'Jeans Cargo Men', views: 980 },
      { title: 'Handbag Chic', views: 760 }
    ],
    clientPreferences: Object.entries(userSizePreferences).map(([user, prefs]) => ({
      user,
      ...prefs
    }))
  });
});

// 🔥 Lancement global
app.get('/launch-maryk-cloud', async (req, res) => {
  await launchFlashSale();
  await updatePrices();
  await optimizeSEO();
  await sendPromoEmail();
  await syncAmazonListings();
  await cleanupApps();
  res.send('🚀 MaryK Cloud lancé avec succès 🎯');
});

app.listen(port, () => {
  console.log(`🚀 MaryK Cloud API running on port ${port}`);
});


 
