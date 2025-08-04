import os
import requests

SHOP_URL = os.getenv("SHOP_URL", "https://hrs15e-9w.myshopify.com")
API_TOKEN = os.getenv("API_TOKEN", "TON_TOKEN_API_ICI")
API_VERSION = os.getenv("API_VERSION", "2024-01")

headers = {
    "X-Shopify-Access-Token": API_TOKEN,
    "Content-Type": "application/json"
}

def test_connection():
    url = f"{SHOP_URL}/admin/api/{API_VERSION}/shop.json"
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:", response.json())

if __name__ == "__main__":
    test_connection()

