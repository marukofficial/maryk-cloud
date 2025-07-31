 # MaryK Cloud – Shopify x Amazon Automation

Cette application connecte automatiquement ma boutique Shopify à Amazon Seller Central avec des fonctions intelligentes et 100 % automatisées via API.

## ✅ Fonctionnalités principales

- 🔁 Mises à jour automatiques des produits Shopify
- 💰 Calcul du prix selon coût fournisseur (×1.3 + 10 $)
- 🧠 SEO automatisé (titre, description, meta description, JSON-LD)
- 👜 Marquage automatique par catégorie (MEN, WOMEN, LASH, BAG, etc.)
- 🌍 Détection automatique des devises et taxes selon la localisation
- 📦 Livraison gratuite internationale avec Shopify Carrier API (option C)
- 🔒 Protection contre la fraude et sécurité des données
- ⭐ Étiquetage automatique des "best sellers"
- 🔄 Vente flash automatique chaque semaine (collection aléatoire)
- 🚫 Les produits en rupture n’apparaissent plus
- 📸 Images produits converties automatiquement en ultra HD fond blanc

## ⚙️ Déploiement avec Railway

> **Étapes minimum requises :**

1. Créer un fichier `index.py` :
```python
import os
import requests
from flask import Flask, jsonify

SHOP_URL = os.getenv("SHOP_URL")
API_TOKEN = os.getenv("API_TOKEN")
API_VERSION = os.getenv("API_VERSION", "2024-01")

app = Flask(__name__)

@app.route("/")
def home():
    return "✅ MaryK Cloud API is running"

@app.route("/products")
def get_products():
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/products.json"
    headers = {
        "X-Shopify-Access-Token": API_TOKEN,
        "Content-Type": "application/json"
    }
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 3000)))
