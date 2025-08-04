import os
import time
import json
import csv
import requests
import pandas as pd
from flask import Flask, request, jsonify
import threading
import openai

# Config API Shopify et OpenAI
SHOP_URL = os.getenv("SHOP_URL", "https://hrs15e-9w.myshopify.com")
API_TOKEN = os.getenv("API_TOKEN", "TON_TOKEN_API_ICI")
API_VERSION = os.getenv("API_VERSION", "2024-01")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "TA_CLE_OPENAI_ICI")
CSV_SOURCE_PATH = os.getenv("CSV_SOURCE_PATH", "products_source.csv")  # Tes données produits avant ID Shopify
CSV_SHOPIFY_PATH = os.getenv("CSV_SHOPIFY_PATH", "shopify_products_variants.csv")  # Export IDs Shopify
openai.api_key = OPENAI_API_KEY

headers = {
    "X-Shopify-Access-Token": API_TOKEN,
    "Content-Type": "application/json"
}

app = Flask(__name__)

# --- Extraction produits + variantes & export CSV ---
def get_all_products():
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/products.json?limit=250"
    products = []
    while url:
        r = requests.get(url, headers=headers)
        r.raise_for_status()
        data = r.json()
        products.extend(data.get("products", []))
        link = r.headers.get("Link")
        if link and 'rel="next"' in link:
            parts = link.split(",")
            next_url = None
            for part in parts:
                if 'rel="next"' in part:
                    next_url = part[part.find("<")+1:part.find(">")]
                    break
            url = next_url
        else:
            url = None
    return products

def export_products_variants(products, filename=CSV_SHOPIFY_PATH):
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["product_id", "handle", "title", "variant_id", "variant_title", "variant_sku"])
        for p in products:
            product_id = p["id"]
            handle = p["handle"]
            title = p["title"]
            variants = p.get("variants", [])
            for v in variants:
                variant_id = v["id"]
                variant_title = v["title"]
                variant_sku = v.get("sku", "")
                writer.writerow([product_id, handle, title, variant_id, variant_title, variant_sku])
    print(f"✅ Export CSV '{filename}' créé avec tous les produits et variantes.")

# --- Nettoyage complet Shopify ---
def delete_product(product_id):
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/products/{product_id}.json"
    r = requests.delete(url, headers=headers)
    if r.status_code in [200, 204]:
        print(f"✅ Produit {product_id} supprimé")
    else:
        print(f"❌ Erreur suppression produit {product_id}: {r.text}")

def get_all_collections():
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/custom_collections.json?limit=250"
    collections = []
    while url:
        r = requests.get(url, headers=headers)
        r.raise_for_status()
        data = r.json()
        collections.extend(data.get("custom_collections", []))
        link = r.headers.get("Link")
        if link and 'rel="next"' in link:
            parts = link.split(",")
            next_url = None
            for part in parts:
                if 'rel="next"' in part:
                    next_url = part[part.find("<")+1:part.find(">")]
                    break
            url = next_url
        else:
            url = None
    return collections

def delete_collection(collection_id):
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/custom_collections/{collection_id}.json"
    r = requests.delete(url, headers=headers)
    if r.status_code in [200, 204]:
        print(f"✅ Collection {collection_id} supprimée")
    else:
        print(f"❌ Erreur suppression collection {collection_id}: {r.text}")

def clean_shopify():
    print("🔄 Début nettoyage Shopify complet...")

    products = get_all_products()
    print(f"Produits trouvés : {len(products)}")
    for p in products:
        delete_product(p["id"])
        time.sleep(0.5)

    collections = get_all_collections()
    print(f"Collections trouvées : {len(collections)}")
    for c in collections:
        delete_collection(c["id"])
        time.sleep(0.5)

    print("✅ Nettoyage Shopify terminé.")

# --- Mise à jour / import produits avec correspondance ID Shopify ---
def update_product(product_id, data):
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/products/{product_id}.json"
    r = requests.put(url, json={"product": data}, headers=headers)
    if r.status_code == 200:
        print(f"✅ Produit {product_id} mis à jour")
    else:
        print(f"❌ Erreur update produit {product_id} : {r.text}")

def import_products():
    print("📥 Import / mise à jour produits avec IDs Shopify...")
    # Charger ton CSV source initial avec données produit (sans IDs Shopify)
    df_source = pd.read_csv(CSV_SOURCE_PATH)
    # Charger CSV Shopify exporté pour mapping IDs
    df_shopify = pd.read_csv(CSV_SHOPIFY_PATH)

    # Fusionner les deux CSV sur le handle (adaptation selon ta colonne clé)
    df = pd.merge(df_source, df_shopify, how="inner", left_on="handle", right_on="handle")
    print(f"Produits à mettre à jour/importer : {len(df)}")

    for _, row in df.iterrows():
        product_id = int(row["product_id"])
        # Construire data à envoyer à Shopify (exemple minimal)
        data = {
            "title": row["title_x"],
            "body_html": row.get("description", ""),
            "tags": row.get("tags", ""),
            "vendor": row.get("vendor", "MaryK Official"),
            # etc. : ajoute ici SEO, pricing, images, stock etc. comme tu veux
        }
        update_product(product_id, data)
        time.sleep(0.5)

# --- Chatbot AI endpoint ---
FAQ_KNOWLEDGE = {
    "retour": "Pour un retour, veuillez suivre la procédure disponible sur notre site ou contactez le support client.",
    "remboursement": "Les remboursements sont traités sous 5 à 7 jours après réception du produit retourné.",
    "suivi": "Merci de fournir votre numéro de commande pour suivre votre livraison.",
    "livraison": "La livraison est rapide, généralement sous 2 à 5 jours ouvrables.",
}

def faq_answer(message):
    for key in FAQ_KNOWLEDGE:
        if key in message.lower():
            return FAQ_KNOWLEDGE[key]
    return None

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    faq_resp = faq_answer(user_message)
    if faq_resp:
        return jsonify({"answer": faq_resp})
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_message}],
            max_tokens=300,
            temperature=0.7,
        )
        answer = response.choices[0].message.content
    except Exception:
        answer = "Désolé, une erreur est survenue. Veuillez réessayer plus tard."
    return jsonify({"answer": answer})

def run_flask():
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

if __name__ == "__main__":
    import threading
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()

    # Étape 1 : nettoyage complet
    clean_shopify()

    # Étape 2 : extraction & export IDs Shopify
    products = get_all_products()
    export_products_variants(products)

    # Étape 3 : import/mise à jour produits
    import_products()

    print("✅ Processus MaryK Cloud terminé.")

