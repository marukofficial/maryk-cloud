// ✅ Importations
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware fictif pour protéger l'accès admin (à remplacer par ton vrai middleware)
function protectAdmin(req, res, next) {
  // Exemple de logique fictive
  if (req.headers.authorization === 'admin') {
    next();
  } else {
    res.status(403).send('Accès refusé');
  }
}

// ✅ Route admin avec UI et GA4
app.get('/admin/ui-dashboard', protectAdmin, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MaryK Admin Dashboard</title>

      <!-- 📈 Google Analytics 4 -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-MARYK12345"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-MARYK12345'); // remplace par ton vrai ID GA4
      </script>

      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          padding: 20px;
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>Bienvenue sur le tableau de bord admin MaryK</h1>
    </body>
    </html>
  `);
});

// ✅ Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});

 
