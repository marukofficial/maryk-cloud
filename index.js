const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// 🔐 Shopify API config
const SHOP_URL = "https://marykofficial.myshopify.com";
const API_TOKEN = "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";
const API_VERSION = "2024-01";

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
      <p>Les apps inutiles seront supprimées automatiquement à chaque démarrage.</p>
    </body>
    </html>
  `);
});

// ✅ SUPPRESSION AUTOMATIQUE DES APPS NON AUTORISÉES
async function removeUnwantedApps() {
  const keepApps = ['Trendsi', 'Eprolo', 'CCWholesale', 'Easyship'];
  const headers = {
    "X-Shopify-Access-Token": API_TOKEN,
    "Content-Type": "application/json"
  };

  try {
    const res = await axios.get(`${SHOP_URL}/admin/api/${API_VERSION}/applications.json`, { headers });
    const apps = res.data.applications;

    for (const app of apps) {
      if (!keepApps.includes(app.title)) {
        console.log(`🔴 Suppression de : ${app.title}`);
        await axios.delete(`${SHOP_URL}/admin/api/${API_VERSION}/applications/${app.id}.json`, { headers });
        console.log(`✅ App supprimée : ${app.title}`);
      } else {
        console.log(`🟢 Conservée : ${app.title}`);
      }
    }
  } catch (err) {
    console.error("❌ Erreur suppression apps :", err.response?.data || err.message);
  }
}

// ✅ Lancer suppression au démarrage
removeUnwantedApps();

// ✅ Lancer le serveur Express
app.listen(port, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${port}`);
});
