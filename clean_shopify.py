import requests
import time
import os

SHOP_URL = os.getenv("SHOP_URL", "https://marykofficial.myshopify.com")
API_TOKEN = os.getenv("API_TOKEN", "TON_TOKEN_API_ICI")
API_VERSION = os.getenv("API_VERSION", "2024-01")

headers = {
    "X-Shopify-Access-Token": API_TOKEN,
    "Content-Type": "application/json"
}

def get_all_products():
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/products.json?limit=250"
    products = []
    while url:
        r = requests.get(url, headers=headers)
        print(f"GET {url} - Status {r.status_code}")
        if r.status_code != 200:
            print(f"Erreur récupération produits: {r.status_code} - {r.text}")
            break
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
    print(f"Total produits trouvés : {len(products)}")
    return products

def delete_product(product_id):
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/products/{product_id}.json"
    r = requests.delete(url, headers=headers)
    print(f"DELETE {url} - Status {r.status_code}")
    if r.status_code in [200, 204]:
        print(f"✅ Produit {product_id} supprimé")
    else:
        print(f"❌ Erreur suppression produit {product_id}: {r.text}")

def clean_shopify():
    print("Début nettoyage Shopify...")
    products = get_all_products()
    for p in products:
        delete_product(p["id"])
        time.sleep(0.5)
    print("Nettoyage terminé.")

if __name__ == "__main__":
    clean_shopify()
