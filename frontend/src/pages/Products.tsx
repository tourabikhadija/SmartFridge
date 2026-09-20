import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import {
  getProducts,
  createProduct,
  getProductByBarcode,
} from "../services/productService";

import { getCategories } from "../services/categoryService";

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
    <div>
      <h1>Mes produits</h1>

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      {/* ========================= */}
      {/* AJOUTER UN PRODUIT */}
      {/* ========================= */}

      <h2>Ajouter un produit</h2>

      <button
        type="button"
        onClick={handleManualMode}
      >
        Ajouter manuellement
      </button>

      <button
        type="button"
        onClick={handleScanMode}
      >
        Scanner un produit
      </button>

      <hr />

      {/* ========================= */}
      {/* SCANNER */}
      {/* ========================= */}

      {mode === "scan" && (
        <div>
          <h3>Scanner un produit</h3>

          {!isScanning && (
            <button
              type="button"
              onClick={startScanner}
            >
              Ouvrir la caméra
            </button>
          )}

          {isScanning && (
            <button
              type="button"
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

          <p>
            Placez le code-barres devant
            la caméra.
          </p>
        </div>
      )}

      {/* ========================= */}
      {/* FORMULAIRE */}
      {/* ========================= */}

      <h3>
        {mode === "scan"
          ? "Informations du produit"
          : "Ajouter manuellement"}
      </h3>

      <form
        onSubmit={handleAddProduct}
      >
        {/* Nom */}

        <div>
          <label>
            Nom du produit
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Ex: Milk"
            required
          />
        </div>

        {/* Catégorie */}

        <div>
          <label>
            Catégorie
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            required
          >
            <option value="">
              Choisir une catégorie
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Date achat */}

        <div>
          <label>
            Date d'achat
          </label>

          <input
            type="date"
            value={purchaseDate}
            onChange={(event) =>
              setPurchaseDate(
                event.target.value
              )
            }
            required
          />
        </div>

        {/* Date expiration */}

        <div>
          <label>
            Date d'expiration
          </label>

          <input
            type="date"
            value={expirationDate}
            onChange={(event) =>
              setExpirationDate(
                event.target.value
              )
            }
            required
          />
        </div>

        {/* Alerte */}

        <div>
          <label>
            Alerte avant expiration
            (jours)
          </label>

          <input
            type="number"
            min="0"
            value={
              expirationAlertDays
            }
            onChange={(event) =>
              setExpirationAlertDays(
                Number(
                  event.target.value
                )
              )
            }
            required
          />
        </div>

        {/* Quantité */}

        <div>
          <label>
            Quantité
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Number(
                  event.target.value
                )
              )
            }
            required
          />
        </div>

        {/* Unité */}

        <div>
          <label>
            Unité
          </label>

          <select
            value={unit}
            onChange={(event) =>
              setUnit(
                event.target.value
              )
            }
          >
            <option value="piece">
              Pièce
            </option>

            <option value="kg">
              Kg
            </option>

            <option value="g">
              g
            </option>

            <option value="l">
              L
            </option>

            <option value="ml">
              ml
            </option>
          </select>
        </div>

        {/* Prix */}

        <div>
          <label>
            Prix (DH)
          </label>

          <input
            type="number"
            min="0"
            value={price}
            onChange={(event) =>
              setPrice(
                Number(
                  event.target.value
                )
              )
            }
            required
          />
        </div>

        <button type="submit">
          Ajouter le produit
        </button>
      </form>

      <hr />

      {/* ========================= */}
      {/* RECHERCHE */}
      {/* ========================= */}

      <h2>
        Liste des produits
      </h2>

      <input
        type="text"
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value
          )
        }
        placeholder="Rechercher un produit..."
      />

      <select
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

        {categories.map(
          (category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          )
        )}
      </select>

      <hr />

      {/* ========================= */}
      {/* LISTE DES PRODUITS */}
      {/* ========================= */}

      {filteredProducts.length ===
      0 ? (
        <p>
          Aucun produit trouvé.
        </p>
      ) : (
        filteredProducts.map(
          (product) => (
            <div
              key={product._id}
            >
              <h3>
                {product.name}
              </h3>

              <p>
                Catégorie :{" "}
                {
                  product.category
                    .name
                }
              </p>

              <p>
                Quantité :{" "}
                {product.quantity}{" "}
                {product.unit}
              </p>

              <p>
                Prix :{" "}
                {product.price} DH
              </p>

              <p>
                Date d'achat :{" "}
                {new Date(
                  product.purchaseDate
                ).toLocaleDateString(
                  "fr-FR"
                )}
              </p>

              <p>
                Date d'expiration :{" "}
                {new Date(
                  product.expirationDate
                ).toLocaleDateString(
                  "fr-FR"
                )}
              </p>

              <p>
                Statut :{" "}
                {product.status}
              </p>

              <Link
                to={`/products/${product._id}`}
              >
                Voir les détails
              </Link>

              <hr />
            </div>
          )
        )
      )}
    </div>
  );
}

export default Products;
