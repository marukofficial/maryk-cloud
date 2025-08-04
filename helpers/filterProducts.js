// helpers/filterProducts.js

/**
 * Filtre les produits conformes (règles marketplace + livraison 3-4 jours).
 * Logue chaque exclusion avec la raison.
 * @param {Array} products
 * @returns {{accepted: Array, rejected: Array}}
 */
function filterCompliantProducts(products) {
  const accepted = [];
  const rejected = [];
  products.forEach(prod => {
    let reason = null;
    if (prod.isDangerous) reason = "Produit dangereux/interdit";
    else if (prod.isRestricted) reason = "Catégorie restreinte";
    else if (!prod.deliveryDays || prod.deliveryDays > 4) reason = "Délai livraison > 4 jours";
    else if (!prod.isCompliant) reason = "Non conformité marketplace";
    if (reason) {
      rejected.push({ ...prod, rejectionReason: reason });
    } else {
      accepted.push(prod);
    }
  });
  return { accepted, rejected };
}

module.exports = { filterCompliantProducts };
