const express = require('express');
const axios = require('axios');
require('dotenv').config(); // ✅ Charge les variables depuis .env

const app = express();
const port = process.env.PORT || 3000;

// 🔐 Shopify API config via .env
const SHOP_URL = process.env.SHOP_URL;
const API_TOKEN = process.env.API_TOKEN;
const API_VERSION = process.env.API_VERSION;

const headers = {
  "X-Shopify-Access-Token": API_TOKEN,
  "Content-Type": "application/json"
};

// ✅ Middleware fictif de protection
function protectAdmin(req, res, next) {
  if (req.headers.authorization === 'admin') {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
}

// ✅ ROUTE : Admin UI Dashboard
app.get('/admin/ui-dashboard', protectAdmin, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MaryK Admin Dashboard</title>

      <!-- Google Analytics 4 -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-MARYK12345"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-MARYK12345');
      </script>

      <style>
        body { font-family: sans-serif; padding: 2rem; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Bienvenue sur le Dashboard Admin MaryK</h1>
      <p>🔒 Les apps doivent désormais être supprimées manuellement via Shopify.</p>
    </body>
    </html>
  `);
});

// ✅ ROUTE TEST ENV : pour vérifier les variables chargées
app.get('/api/env-check', (req, res) => {
  const status = {
    SHOP_URL: !!SHOP_URL,
    API_TOKEN: !!API_TOKEN,
    API_VERSION: !!API_VERSION
  };
  res.json({ env: status });
});

// 🚫 removeUnwantedApps désactivé car endpoint obsolète
function removeUnwantedApps() {
  console.log("⚠️ Shopify ne permet plus de lister/supprimer les apps via API. Suppression manuelle requise.");
}

// ✅ Appel de la fonction (log uniquement)
removeUnwantedApps();

// ✅ Lancer le serveur Express
app.listen(port, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${port}`);
});

