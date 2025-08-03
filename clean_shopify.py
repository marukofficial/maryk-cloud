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
        r.raise_for_status()
        data = r.json()
        products.extend(data.get("products", []))
        # Pagination
        link = r.headers.get("Link")
        if link and 'rel="next"' in link:
            url = link.split(";")[0].strip("<> ")
        else:
            url = None
    return products

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
        # Pagination
        link = r.headers.get("Link")
        if link and 'rel="next"' in link:
            url = link.split(";")[0].strip("<> ")
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

def get_metafields_for_product(product_id):
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/products/{product_id}/metafields.json"
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.json().get("metafields", [])

def delete_metafield(metafield_id):
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/metafields/{metafield_id}.json"
    r = requests.delete(url, headers=headers)
    if r.status_code in [200, 204]:
        print(f"✅ Metafield {metafield_id} supprimé")
    else:
        print(f"❌ Erreur suppression metafield {metafield_id}: {r.text}")

def clean_shopify():
    print("🔄 Début nettoyage Shopify...")

    # Supprimer tous les produits
    products = get_all_products()
    print(f"Produits trouvés : {len(products)}")
    for p in products:
        delete_product(p["id"])
        time.sleep(0.5)

    # Supprimer toutes les collections personnalisées
    collections = get_all_collections()
    print(f"Collections trouvées : {len(collections)}")
    for c in collections:
        delete_collection(c["id"])
        time.sleep(0.5)

    # Supprimer tous les metafields produits
    for p in products:
        metafields = get_metafields_for_product(p["id"])
        for mf in metafields:
            delete_metafield(mf["id"])
            time.sleep(0.2)

    print("✅ Nettoyage terminé.")

if __name__ == "__main__":
    clean_shopify()
