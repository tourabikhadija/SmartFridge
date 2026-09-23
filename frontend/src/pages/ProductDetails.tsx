import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  getProductById,
  deleteProduct,
  consumeProduct,
  updateProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import UserBadge from "../components/UserBadge";
import { getCategoryIcon } from "../utils/categoryIcons";
import "../styles/Dashboard.css";
import "../styles/Products.css";
import "../styles/ProductDetails.css";

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

  status: "valide" | "bientot_expire" | "expire";
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  const [quantityToConsume, setQuantityToConsume] =
    useState(1);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modification
  const [isEditing, setIsEditing] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPurchaseDate, setEditPurchaseDate] =
    useState("");
  const [editExpirationDate, setEditExpirationDate] =
    useState("");
  const [editExpirationAlertDays, setEditExpirationAlertDays] =
    useState(3);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editUnit, setEditUnit] = useState("piece");
  const [editPrice, setEditPrice] = useState(0);

  // Charger le produit
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("Produit introuvable");
        return;
      }

      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Impossible de charger le produit");
        }
      }
    };

    loadProduct();
  }, [id]);

  // Supprimer le produit
  const handleDelete = async () => {
    if (!id) {
      return;
    }

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      await deleteProduct(id);

      navigate("/products");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Impossible de supprimer le produit");
      }
    }
  };

  // Consommer le produit
  const handleConsume = async () => {
    if (!id || !product) {
      return;
    }

    setError("");
    setSuccess("");

    // Vérifier la quantité
    if (quantityToConsume <= 0) {
      setError(
        "La quantité doit être supérieure à 0"
      );
      return;
    }

    if (quantityToConsume > product.quantity) {
      setError(
        "La quantité à consommer est supérieure à la quantité disponible"
      );
      return;
    }

    try {
      const data = await consumeProduct(
        id,
        quantityToConsume
      );

      // Mettre à jour le produit
      setProduct({
        ...product,
        quantity: data.product.quantity,
      });

      setSuccess(
        `Produit consommé avec succès : ${data.consumption.amount} DH`
      );

      // Remettre la quantité à 1
      setQuantityToConsume(1);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Impossible de consommer le produit"
        );
      }
    }
  };

  // Charger les catégories pour le formulaire de modification
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        // On ignore : le formulaire reste utilisable
      }
    };

    loadCategories();
  }, []);

  // Ouvrir le formulaire de modification
  const handleEditClick = () => {
    if (!product) {
      return;
    }

    setEditName(product.name);
    setEditCategory(product.category._id);
    setEditPurchaseDate(
      product.purchaseDate.substring(0, 10)
    );
    setEditExpirationDate(
      product.expirationDate.substring(0, 10)
    );
    setEditExpirationAlertDays(
      product.expirationAlertDays
    );
    setEditQuantity(product.quantity);
    setEditUnit(product.unit);
    setEditPrice(product.price);

    setError("");
    setSuccess("");

    setIsEditing(true);
  };

  // Fermer le formulaire sans modifier les données
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Enregistrer les modifications
  const handleUpdateProduct = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!id) {
      setError("Produit introuvable");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const data = await updateProduct(id, {
        name: editName,
        category: editCategory,
        purchaseDate: editPurchaseDate,
        expirationDate: editExpirationDate,
        expirationAlertDays: editExpirationAlertDays,
        quantity: editQuantity,
        unit: editUnit,
        price: editPrice,
      });

      setProduct((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          ...data,
          category: current.category,
        };
      });

      setSuccess("Produit modifié avec succès");

      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Impossible de modifier le produit"
        );
      }
    }
  };

  if (error && !product) {
    return (
      <div className="dashboard product-details-page">
        <p className="dashboard-error">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="dashboard product-details-page">
        <p className="empty-message">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard product-details-page">
      <div className="product-details-container">
        <header className="product-details-header">
          <Link
            to="/products"
            className="products-btn products-back-btn"
          >
            ← Retour aux produits
          </Link>

          <div className="product-details-heading">
            <div>
              <span className="dashboard-label">
                Détails du produit
              </span>
              <h1>{product.name}</h1>
              <p className="product-details-category">
                <span
                  className="product-card-icon"
                  aria-hidden="true"
                >
                  {getCategoryIcon(product.category.name)}
                </span>
                {product.category.name}
              </p>
            </div>

            <span className={`status ${product.status}`}>
              {product.status === "valide"
                ? "Valide"
                : product.status === "bientot_expire"
                  ? "Bientôt expiré"
                  : "Expiré"}
            </span>
          </div>

          <UserBadge />
        </header>

        {error && <p className="dashboard-error">{error}</p>}

        {success && <p className="dashboard-success">{success}</p>}

        {isEditing ? (
          <section className="dashboard-section">
            <div className="section-heading">
              <h2>Modifier le produit</h2>
            </div>

            <form
              className="details-card details-edit-card"
              onSubmit={handleUpdateProduct}
            >
              <div className="details-edit-grid">
                <div className="details-edit-field">
                  <label>Nom du produit</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) =>
                      setEditName(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="details-edit-field">
                  <label>Catégorie</label>
                  <select
                    value={editCategory}
                    onChange={(event) =>
                      setEditCategory(event.target.value)
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

                <div className="details-edit-field">
                  <label>Date d'achat</label>
                  <input
                    type="date"
                    value={editPurchaseDate}
                    onChange={(event) =>
                      setEditPurchaseDate(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="details-edit-field">
                  <label>Date d'expiration</label>
                  <input
                    type="date"
                    value={editExpirationDate}
                    onChange={(event) =>
                      setEditExpirationDate(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="details-edit-field">
                  <label>
                    Alerte avant expiration (jours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editExpirationAlertDays}
                    onChange={(event) =>
                      setEditExpirationAlertDays(
                        Number(event.target.value)
                      )
                    }
                    required
                  />
                </div>

                <div className="details-edit-field">
                  <label>Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={editQuantity}
                    onChange={(event) =>
                      setEditQuantity(
                        Number(event.target.value)
                      )
                    }
                    required
                  />
                </div>

                <div className="details-edit-field">
                  <label>Unité</label>
                  <select
                    value={editUnit}
                    onChange={(event) =>
                      setEditUnit(event.target.value)
                    }
                  >
                    <option value="piece">Pièce</option>
                    <option value="kg">Kg</option>
                    <option value="g">g</option>
                    <option value="l">L</option>
                    <option value="ml">ml</option>
                  </select>
                </div>

                <div className="details-edit-field">
                  <label>Prix (DH)</label>
                  <input
                    type="number"
                    min="0"
                    value={editPrice}
                    onChange={(event) =>
                      setEditPrice(
                        Number(event.target.value)
                      )
                    }
                    required
                  />
                </div>
              </div>

              <div className="details-edit-actions">
                <button
                  type="submit"
                  className="products-btn details-edit-submit"
                >
                  Enregistrer les modifications
                </button>

                <button
                  type="button"
                  className="products-btn details-edit-cancel"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
        {/* ========================= */}
        {/* INFORMATIONS PRINCIPALES */}
        {/* ========================= */}

        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Informations principales</h2>
          </div>

          <div className="details-card">
            <div className="details-grid">
              <div className="details-item">
                <label>Nom du produit</label>
                <strong>{product.name}</strong>
              </div>

              <div className="details-item">
                <label>Catégorie</label>
                <strong>{product.category.name}</strong>
              </div>

              <div className="details-item">
                <label>Quantité</label>
                <strong>
                  {product.quantity} {product.unit}
                </strong>
              </div>

              <div className="details-item">
                <label>Quantité initiale</label>
                <strong>
                  {product.initialQuantity} {product.unit}
                </strong>
              </div>

              <div className="details-item">
                <label>Unité</label>
                <strong>{product.unit}</strong>
              </div>

              <div className="details-item">
                <label>Prix</label>
                <strong>{product.price} DH</strong>
              </div>

              <div className="details-item">
                <label>Date d'achat</label>
                <strong>
                  {new Date(
                    product.purchaseDate
                  ).toLocaleDateString("fr-FR")}
                </strong>
              </div>

              <div className="details-item">
                <label>Date d'expiration</label>
                <strong>
                  {new Date(
                    product.expirationDate
                  ).toLocaleDateString("fr-FR")}
                </strong>
              </div>

              <div className="details-item">
                <label>Alerte avant expiration</label>
                <strong>
                  {product.expirationAlertDays} jour(s)
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= */}
        {/* STATUT / EXPIRATION */}
        {/* ========================= */}

        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Statut / expiration</h2>
          </div>

          <div
            className={`details-card details-status-card status-${product.status}`}
          >
            <div
              className={`details-status-icon ${product.status}`}
            >
              {product.status === "valide"
                ? "✓"
                : product.status === "bientot_expire"
                  ? "◷"
                  : "!"}
            </div>

            <div className="details-status-info">
              <span className="details-status-title">
                {product.status === "valide"
                  ? "Produit valide"
                  : product.status === "bientot_expire"
                    ? "Produit bientôt expiré"
                    : "Produit expiré"}
              </span>

              <p className="details-status-expiration">
                Date d'expiration :{" "}
                {new Date(
                  product.expirationDate
                ).toLocaleDateString("fr-FR")}
              </p>

              <p className="details-status-days">
                {(() => {
                  const today = new Date();
                  const expiration = new Date(
                    product.expirationDate
                  );

                  const difference = Math.ceil(
                    (expiration.getTime() -
                      today.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  if (product.status === "expire") {
                    const daysAgo = Math.abs(difference);
                    return `Expiré depuis ${daysAgo} jour${
                      daysAgo > 1 ? "s" : ""
                    }`;
                  }

                  if (difference <= 0) {
                    return "Expire aujourd'hui";
                  }

                  return `${difference} jour${
                    difference > 1 ? "s" : ""
                  } restants`;
                })()}
              </p>
            </div>
          </div>
        </section>

        {/* ========================= */}
        {/* CONSOMMER LE PRODUIT */}
        {/* ========================= */}

        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Consommer le produit</h2>
          </div>

          <div className="details-card details-consume-card">
            <div className="details-consume-row">
              <div className="products-field">
                <label>Quantité à consommer</label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantityToConsume}
                  onChange={(event) =>
                    setQuantityToConsume(
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              <button
                type="button"
                className="products-btn products-btn-primary"
                onClick={handleConsume}
                disabled={product.quantity === 0}
              >
                Consommer
              </button>
            </div>
          </div>
        </section>

        {/* ========================= */}
        {/* ACTIONS */}
        {/* ========================= */}

        <div className="details-actions">
          <button
            type="button"
            className="products-btn products-btn-primary"
            onClick={handleEditClick}
          >
            Modifier
          </button>

          <button
            type="button"
            className="products-btn products-btn-danger"
            onClick={handleDelete}
          >
            Supprimer
          </button>

          <Link to="/products" className="products-btn">
            Retour
          </Link>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;