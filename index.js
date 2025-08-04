// ✅ MaryK Cloud API Backend (Express)
// Chargement des variables d'environnement
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Test de vie
app.get('/', (req, res) => {
  res.send('MaryK Cloud API is running 🚀');
});

// ✅ Shopify Endpoint
app.get('/api/shopify-test', (req, res) => {
  res.json({ ok: true, message: "Shopify route active!" });
});

// ✅ Amazon Endpoint
app.get('/api/amazon-test', (req, res) => {
  res.json({ ok: true, message: "Amazon route active!" });
});

// ✅ Facebook/Instagram Endpoint
app.get('/api/social-test', (req, res) => {
  res.json({ ok: true, message: "Social route active!" });
});

// ✅ GA4 Analytics Endpoint
app.get('/api/ga4-test', (req, res) => {
  res.json({ ok: true, message: "GA4 route active!" });
});

// ➕ Ajoute ici toutes tes routes "feature" centralisées
// (import de routes, authent, dashboard, etc.)

// ✅ Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaryK Cloud API running on port ${PORT}`);
});

