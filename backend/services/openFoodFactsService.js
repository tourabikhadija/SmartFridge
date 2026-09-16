const getProductByBarcode = async (barcode) => {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v3/product/${barcode}`,
    {
      headers: {
        "User-Agent": "ROCT-SmartFridge/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to connect to Open Food Facts");
  }

  const data = await response.json();

  if (!data.product) {
    return null;
  }

  const product = data.product;

 const categories = product.categories_tags || [];

console.log("CATEGORIES:", categories);

let category = null;

// Fruits
if (
  categories.includes("en:fruits") ||
  categories.includes("en:fresh-fruits")
) {
  category = "6a96b226ffbe3500d625b2e5";
}

// Légumes
else if (
  categories.includes("en:vegetables") ||
  categories.includes("en:fresh-vegetables")
) {
  category = "6a96af63ffbe3500d625b2cc";
}

// Produits laitiers
else if (
  categories.includes("en:dairies") ||
  categories.includes("en:milks") ||
  categories.includes("en:milks-liquid-and-powder") ||
  categories.includes("en:cheeses") ||
  categories.includes("en:fermented-milk-products") ||
  categories.includes("en:dairy-desserts")
) {
  category = "6a96af3affbe3500d625b2c9";
}

// Viandes
else if (
  categories.includes("en:meats") ||
  categories.includes("en:chicken-meats") ||
  categories.includes("en:beef-meats") ||
  categories.includes("en:pork-meats") ||
  categories.includes("en:turkey-meats")
) {
  category = "6aa95830977d64ae0fcf2b04";
}

// Boissons
else if (
  categories.includes("en:beverages") ||
  categories.includes("en:non-alcoholic-beverages") ||
  categories.includes("en:sodas")
) {
  category = "6aa9587f977d64ae0fcf2b06";
}

// Produits surgelés
else if (
  categories.includes("en:frozen-foods") ||
  categories.includes("en:frozen-products")
) {
  category = "6aa95a58977d64ae0fcf2b10";
}

// Conserves
else if (
  categories.includes("en:canned-foods") ||
  categories.includes("en:canned-products") ||
  categories.includes("en:preserved-foods")
) {
  category = "6aa95916977d64ae0fcf2b0a";
}

// Autre
else {
  category = "6aa94c6e977d64ae0fcf2afa";
}

console.log("CATEGORY ID:", category);

  return {
    name: product.product_name || "",
    quantity: product.product_quantity || "",
    unit: product.product_quantity_unit || "",
    image: product.image_front_url || "",
    category: category,
  };
};

module.exports = {
  getProductByBarcode,
};