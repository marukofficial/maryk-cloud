require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// === HEALTH/PING ROUTES ===
app.get('/', (req, res) => res.send('MaryK Cloud API is running 🚀'));
app.get('/health', (req, res) => res.json({ status: "ok", env: process.env.API_CUSTOM_DOMAIN }));

// === SHOPIFY ROUTES ===
app.get('/api/shopify/test', (req, res) => res.json({ ok: true, message: "Shopify route active!" }));
app.get('/api/shopify/products', (req, res) => res.json({ ok: true, data: "List Shopify Products [TODO]" }));
app.post('/api/shopify/import', (req, res) => res.json({ ok: true, data: "Import product to Shopify [TODO]" }));
app.get('/api/shopify/export', (req, res) => res.json({ ok: true, data: "Export Shopify Products [TODO]" }));
app.post('/api/shopify/price-update', (req, res) => res.json({ ok: true, data: "Price Update [TODO]" }));
app.get('/api/shopify/reviews', (req, res) => res.json({ ok: true, data: "Shopify Product Reviews [TODO]" }));
app.get('/api/shopify/orders', (req, res) => res.json({ ok: true, data: "List Shopify Orders [TODO]" }));
app.post('/api/shopify/flash-sale', (req, res) => res.json({ ok: true, data: "Flash Sale Activated [TODO]" }));

// === AMAZON ROUTES ===
app.get('/api/amazon/test', (req, res) => res.json({ ok: true, message: "Amazon route active!" }));
app.get('/api/amazon/products', (req, res) => res.json({ ok: true, data: "List Amazon Products [TODO]" }));
app.post('/api/amazon/import', (req, res) => res.json({ ok: true, data: "Import product to Amazon [TODO]" }));
app.get('/api/amazon/export', (req, res) => res.json({ ok: true, data: "Export Amazon Products [TODO]" }));
app.get('/api/amazon/reviews', (req, res) => res.json({ ok: true, data: "Amazon Reviews [TODO]" }));
app.post('/api/amazon/order-sync', (req, res) => res.json({ ok: true, data: "Amazon Order Sync [TODO]" }));

// === FACEBOOK/INSTAGRAM ROUTES ===
app.get('/api/social/test', (req, res) => res.json({ ok: true, message: "Social route active!" }));
app.get('/api/social/shop', (req, res) => res.json({ ok: true, data: "FB/Instagram Shop Sync [TODO]" }));
app.post('/api/social/pixel-event', (req, res) => res.json({ ok: true, data: "Pixel Event [TODO]" }));

// === GA4 ANALYTICS ROUTES ===
app.get('/api/ga4/test', (req, res) => res.json({ ok: true, message: "GA4 route active!" }));
app.post('/api/ga4/event', (req, res) => res.json({ ok: true, data: "Send custom GA4 event [TODO]" }));

// === SMTP / EMAIL ROUTES ===
app.post('/api/email/test', (req, res) => res.json({ ok: true, data: "Email test [TODO]" }));
app.post('/api/email/alert', (req, res) => res.json({ ok: true, data: "Send alert email [TODO]" }));
app.post('/api/email/post-purchase', (req, res) => res.json({ ok: true, data: "Post-purchase email [TODO]" }));

// === DASHBOARD / ADMIN ===
app.get('/api/dashboard/summary', (req, res) => res.json({ ok: true, data: "Dashboard Summary [TODO]" }));
app.get('/api/dashboard/flash-sales', (req, res) => res.json({ ok: true, data: "Flash Sales List [TODO]" }));
app.get('/api/dashboard/best-sellers', (req, res) => res.json({ ok: true, data: "Best Sellers List [TODO]" }));
app.get('/api/dashboard/abandoned-carts', (req, res) => res.json({ ok: true, data: "Abandoned Carts List [TODO]" }));

// === SÉCURITÉ & WEBHOOKS ===
app.post('/api/webhook/shopify', (req, res) => res.json({ ok: true, data: "Shopify Webhook received [TODO]" }));
app.post('/api/security/fraud-alert', (req, res) => res.json({ ok: true, data: "Fraud alert sent [TODO]" }));

// === EXEMPLE: AUTH ===
app.post('/api/auth/login', (req, res) => res.json({ ok: true, data: "Login [TODO]" }));

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaryK Cloud API running on port ${PORT}`);
});


