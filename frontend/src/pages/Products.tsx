import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import {
  getProducts,
  createProduct,
  getProductByBarcode,
} from "../services/productService";

import { getCategories } from "../services/categoryService";
import "../styles/Dashboard.css";
import "../styles/Products.css";

type Category = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;

  category: {
    _id: string;
    name: string;
  };

  purchaseDate: string;
  expirationDate: string;
  expirationAlertDays: number;

  quantity: number;
  initialQuantity: number;

  unit: string;
  price: number;

  status:
    | "valide"
    | "bientot_expire"
    | "expire";
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mode d'ajout
  const [mode, setMode] = useState<
    "manuel" | "scan"
  >("manuel");

  // Scanner
  const [scanner, setScanner] =
    useState<Html5Qrcode | null>(null);

  const [isScanning, setIsScanning] =
    useState(false);

  // Recherche
  const [search, setSearch] = useState("");

  // Filtre catégorie
  const [selectedCategory, setSelectedCategory] =
    useState("");

  // Produit
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [purchaseDate, setPurchaseDate] =
    useState("");

  const [expirationDate, setExpirationDate] =
    useState("");

  const [expirationAlertDays, setExpirationAlertDays] =
    useState(3);

  const [quantity, setQuantity] = useState(1);

  const [unit, setUnit] = useState("piece");

  const [price, setPrice] = useState(0);

  useEffect(() => {
    loadProducts();
    loadCategories();

    return () => {
      stopScanner();
    };
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Impossible de charger les produits"
        );
      }
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Impossible de charger les catégories"
        );
      }
    }
  };

  // Démarrer la caméra
  const startScanner = async () => {
    setError("");
    setSuccess("");

    try {
      const newScanner = new Html5Qrcode(
        "barcode-reader"
      );

      setScanner(newScanner);
      setIsScanning(true);

      await newScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 150,
          },
        },
        async (decodedText) => {
          // Barcode trouvé
          await stopScanner();

          setSuccess(
            "Code-barres détecté. Recherche du produit..."
          );

          try {
            const data =
              await getProductByBarcode(
                decodedText
              );

            // Nom
            setName(data.name || "");

            // Quantité
            setQuantity(
              data.quantity !== undefined
                ? data.quantity
                : 1
            );

            // Unité
            setUnit(
              data.unit || "piece"
            );

            // Catégorie
            setCategory(
              data.category || ""
            );

            setSuccess(
              "Produit trouvé. Complétez les informations."
            );
          } catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError(
                "Produit introuvable"
              );
            }
          }
        },
        () => {
          // On ignore les erreurs de lecture
          // pendant que la caméra cherche
        }
      );
    } catch (error) {
      setIsScanning(false);

      setError(
        "Impossible d'ouvrir la caméra. Vérifiez les permissions."
      );
    }
  };

  // Arrêter la caméra
  const stopScanner = async () => {
    if (scanner) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch {
        // La caméra est déjà arrêtée
      }

      setScanner(null);
    }

    setIsScanning(false);
  };

  // Changer vers manuel
  const handleManualMode = async () => {
    await stopScanner();

    setMode("manuel");

    setError("");
    setSuccess("");
  };

  // Changer vers scan
  const handleScanMode = () => {
    setMode("scan");

    setError("");
    setSuccess("");
  };

  // Ajouter le produit
  const handleAddProduct = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const newProduct =
        await createProduct({
          name,
          category,
          purchaseDate,
          expirationDate,
          expirationAlertDays,
          quantity,
          unit,
          price,
        });

      setProducts((currentProducts) => [
        ...currentProducts,
        newProduct,
      ]);

      setSuccess(
        "Produit ajouté avec succès"
      );

      // Réinitialiser
      setName("");
      setCategory("");
      setPurchaseDate("");
      setExpirationDate("");
      setExpirationAlertDays(3);
      setQuantity(1);
      setUnit("piece");
      setPrice(0);

      setMode("manuel");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Impossible d'ajouter le produit"
        );
      }
    }
  };

  // Filtrer les produits
  const filteredProducts =
    products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory === "" ||
        product.category._id ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (
    <div className="dashboard products-page">
      <header className="dashboard-header">
        <span className="dashboard-label">SmartFridge</span>
        <h1>Mes produits</h1>
        <p>
          Ajoutez, organisez et suivez les produits de
          votre réfrigérateur.
        </p>
      </header>

      {error && <p className="dashboard-error">{error}</p>}

      {success && <p className="dashboard-success">{success}</p>}

      {/* ========================= */}
      {/* AJOUTER UN PRODUIT */}
      {/* ========================= */}

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Ajouter un produit</h2>
        </div>

        <div className="products-add-card">
          <div className="products-add-header">
            <p>
              Ajoutez un produit manuellement ou
              scannez son code-barres.
            </p>

            <div className="category-buttons">
              <button
                type="button"
                className={mode === "manuel" ? "active" : ""}
                onClick={handleManualMode}
              >
                Ajouter manuellement
              </button>

              <button
                type="button"
                className={mode === "scan" ? "active" : ""}
                onClick={handleScanMode}
              >
                Scanner un produit
              </button>
            </div>
          </div>

          {/* ========================= */}
          {/* SCANNER */}
          {/* ========================= */}

          {mode === "scan" && (
            <div className="products-scanner">
              <h3>Scanner un produit</h3>

              {!isScanning && (
                <button
                  type="button"
                  className="products-btn products-btn-primary"
                  onClick={startScanner}
                >
                  Ouvrir la caméra
                </button>
              )}

              {isScanning && (
                <button
                  type="button"
                  className="products-btn products-btn-danger"
                  onClick={stopScanner}
                >
                  Arrêter la caméra
                </button>
              )}

              <div
                id="barcode-reader"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  marginTop: "20px",
                }}
              ></div>

              <p className="products-scanner-hint">
                Placez le code-barres devant la caméra.
              </p>
            </div>
          )}

          {mode === "scan" && (
            <hr className="products-divider" />
          )}

          {/* ========================= */}
          {/* FORMULAIRE */}
          {/* ========================= */}

          <h3 className="products-form-title">
            {mode === "scan"
              ? "Informations du produit"
              : "Ajouter manuellement"}
          </h3>

          <form className="products-form" onSubmit={handleAddProduct}>
            <div className="products-form-grid">
              {/* Nom */}
              <div className="products-field">
                <label>Nom du produit</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Ex: Milk"
                  required
                />
              </div>

              {/* Catégorie */}
              <div className="products-field">
                <label>Catégorie</label>
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Choisir une catégorie
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date achat */}
              <div className="products-field">
                <label>Date d'achat</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(event) =>
                    setPurchaseDate(event.target.value)
                  }
                  required
                />
              </div>

              {/* Date expiration */}
              <div className="products-field">
                <label>Date d'expiration</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(event) =>
                    setExpirationDate(event.target.value)
                  }
                  required
                />
              </div>

              {/* Alerte */}
              <div className="products-field">
                <label>
                  Alerte avant expiration (jours)
                </label>
                <input
                  type="number"
                  min="0"
                  value={expirationAlertDays}
                  onChange={(event) =>
                    setExpirationAlertDays(
                      Number(event.target.value)
                    )
                  }
                  required
                />
              </div>

              {/* Quantité */}
              <div className="products-field">
                <label>Quantité</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Number(event.target.value)
                    )
                  }
                  required
                />
              </div>

              {/* Unité */}
              <div className="products-field">
                <label>Unité</label>
                <select
                  value={unit}
                  onChange={(event) =>
                    setUnit(event.target.value)
                  }
                >
                  <option value="piece">Pièce</option>
                  <option value="kg">Kg</option>
                  <option value="g">g</option>
                  <option value="l">L</option>
                  <option value="ml">ml</option>
                </select>
              </div>

              {/* Prix */}
              <div className="products-field">
                <label>Prix (DH)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      Number(event.target.value)
                    )
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="products-btn products-btn-primary products-submit"
            >
              Ajouter le produit
            </button>
          </form>
        </div>
      </section>

      {/* ========================= */}
      {/* LISTE DES PRODUITS */}
      {/* ========================= */}

      <section className="dashboard-section products-section">
        <div className="section-heading">
          <h2>Liste des produits</h2>
          <span>{filteredProducts.length} produits</span>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher un produit..."
          />
        </div>

        <div className="categories products-filter">
          <h3>Catégories</h3>

          <select
            className="products-filter-select"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
          >
            <option value="">
              Toutes les catégories
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="empty-message">
            Aucun produit trouvé.
          </p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-card-header">
                  <h3>{product.name}</h3>
                  <span className={`status ${product.status}`}>
                    {product.status}
                  </span>
                </div>

                <p className="product-category">
                  {product.category.name}
                </p>

                <div className="product-info">
                  <p>
                    <span>Quantité</span>
                    {product.quantity} {product.unit}
                  </p>

                  <p>
                    <span>Prix</span>
                    {product.price} DH
                  </p>

                  <p>
                    <span>Date d'achat</span>
                    {new Date(
                      product.purchaseDate
                    ).toLocaleDateString("fr-FR")}
                  </p>

                  <p>
                    <span>Date d'expiration</span>
                    {new Date(
                      product.expirationDate
                    ).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <Link
                  className="products-details-link"
                  to={`/products/${product._id}`}
                >
                  Voir les détails
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;
