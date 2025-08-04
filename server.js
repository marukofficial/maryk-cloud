// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Helpers à importer (crée-les après !)
const { filterCompliantProducts } = require('./helpers/filterProducts');
const { generateBacklinks } = require('./helpers/backlinks');
const { generateSuperKeywords } = require('./helpers/keywords');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- ROUTE TEST ---
app.get('/', (req, res) => {
  res.send('MaryK Cloud API is running!');
});

// --- SHOPIFY -> AMAZON EXPORT (exemple) ---
app.post('/api/export-amazon', async (req, res) => {
  // À remplacer par ta vraie fonction de fetch produits Shopify
  let products = req.body.products || [];
  let { accepted, rejected } = filterCompliantProducts(products);

  // Enrichir chaque produit accepté avec backlinks + keywords
  for (let prod of accepted) {
    prod.keywords = await generateSuperKeywords(prod);
    prod.backlinks = generateBacklinks(prod, accepted);
  }

  // (Appel API Amazon ici si branché)
  res.json({
    exported: accepted.length,
    skipped: rejected.length,
    skippedDetails: rejected.map(p => ({
      id: p.id,
      title: p.title,
      reason: p.rejectionReason
    })),
    enrichedProducts: accepted
  });
});

// --- AUTRES ROUTES À AJOUTER (Google, TikTok, FB, eBay, PDF, Dashboard...) ---
// Copie/colle la structure ci-dessus pour chaque export/import désiré
// Exemples : /api/export-google, /api/export-tiktok, etc.

// --- DÉMARRAGE SERVEUR ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MaryK Cloud API is running on port ${PORT}`);
});
