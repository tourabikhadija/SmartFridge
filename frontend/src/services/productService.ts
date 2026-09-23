const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3001") +
  "/api/products";

export const getProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get products");
  }

  return data;
};

export const getProductById = async (productId: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${productId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get product");
  }

  return data;
};


export const createProduct = async (productData: {
  name: string;
  category: string;
  purchaseDate: string;
  expirationDate: string;
  expirationAlertDays: number;
  quantity: number;
  unit: string;
  price: number;
}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data;
};

export const updateProduct = async (
  productId: string,
  productData: {
    name: string;
    category: string;
    purchaseDate: string;
    expirationDate: string;
    expirationAlertDays: number;
    quantity: number;
    unit: string;
    price: number;
  }
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }

  return data;
};

export const deleteProduct = async (productId: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
};

export const consumeProduct = async (
  productId: string,
  quantity: number
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/${productId}/consume`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de consommer le produit"
    );
  }

  return data;
};

// Rechercher un produit avec son code-barres
export const getProductByBarcode = async (barcode: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/barcode/${barcode}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Produit introuvable"
    );
  }

  return data;
};