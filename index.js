const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// ➕ Test : route de base
app.get('/', (req, res) => {
  res.send('MaryK Cloud API is live.');
});

// ➕ Route test : infos boutique fictives
app.get('/api/shop-info', (req, res) => {
  res.json({
    name: "MaryK Official",
    url: "https://marykofficial.myshopify.com",
    status: "API opérationnelle"
  });
});

app.listen(port, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${port}`);
});

