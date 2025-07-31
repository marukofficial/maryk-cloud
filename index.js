app.get('/admin/ui-dashboard', protectAdmin, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MaryK Admin Dashboard</title>

      <!-- ✅ Google Analytics 4 (GA4) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y70RS4K3EE"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-Y70RS4K3EE');
      </script>

      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background: #fff;
          color: #333;
          padding: 10px;
        }
        h2 {
          color: #ff007b;
          text-align: center;
          font-size: 1.6rem;
        }
        .card {
          background: #f9f9f9;
          margin: 10px 0;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .card h3 {
          margin: 0 0 8px;
          font-size: 1.2rem;
        }
        ul {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }
        li {
          padding: 4px 0;
          font-size: 0.95rem;
        }

        @media screen and (min-width: 768px) {
          body { padding: 20px 40px; }
          h2 { font-size: 2rem; }
          .card { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h2>🌟 MaryK Admin Dashboard</h2>

      <div class="card">
        <h3>🔥 Vente Flash Active</h3>
        <p>Produits en promo : 24</p>
      </div>

      <div class="card">
        <h3>👀 Trafic Actuel (via GA4)</h3>
        <ul>
          <li>Visiteurs actifs : (voir Google Analytics)</li>
          <li>Mobile / Desktop : (données live)</li>
        </ul>
      </div>

      <div class="card">
        <h3>⭐ Top Produits</h3>
        <ul>
          <li>Tech Lash Pro – 1220 vues</li>
          <li>Men Cargo Jeans – 940 vues</li>
        </ul>
      </div>

      <div class="card">
        <h3>🧬 Préférences clients (taille)</h3>
        <ul>
          ${Object.entries(userSizePreferences).map(([k,v]) => `<li>${k}: ${JSON.stringify(v)}</li>`).join('')}
        </ul>
      </div>

      <div class="card">
        <h3>📊 SEO Boost Résultats</h3>
        <ul>
          <li>trendy men clothing → top 3</li>
          <li>trendy women outfit → top 2</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});



 
