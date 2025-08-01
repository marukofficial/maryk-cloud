app.post('/api/test-product', async (req, res) => {
  try {
    const response = await axios.post(
      `${SHOP_URL}/admin/api/${API_VERSION}/products.json`,
      {
        product: {
          title: "Test Product MaryK",
          body_html: "<strong>Produit de test via API</strong>",
          vendor: "MaryK",
          product_type: "Makeup",
          tags: "AMAZON_READY",
          published: true,
          images: [
            {
              src: "https://cdn.shopify.com/s/files/1/0751/2116/4517/files/test-maryk.jpg"
            }
          ],
          variants: [
            {
              option1: "Default Title",
              price: "39.99",
              sku: "TESTSKU123",
              cost: "20.00"
            }
          ]
        }
      },
      { headers }
    );

    res.status(200).json({
      success: true,
      product_id: response.data.product.id,
      title: response.data.product.title,
      handle: response.data.product.handle,
    });

  } catch (err) {
    console.error("❌ Erreur création produit :", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

