import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  getProductById,
  deleteProduct,
  consumeProduct,
} from "../services/productService";

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

  if (error && !product) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      <p>
        Catégorie : {product.category.name}
      </p>

      <p>
        Quantité actuelle : {product.quantity}{" "}
        {product.unit}
      </p>

      <p>
        Quantité initiale : {product.initialQuantity}{" "}
        {product.unit}
      </p>

      <p>
        Prix : {product.price} DH
      </p>

      <p>
        Date d'achat :{" "}
        {new Date(
          product.purchaseDate
        ).toLocaleDateString("fr-FR")}
      </p>

      <p>
        Date d'expiration :{" "}
        {new Date(
          product.expirationDate
        ).toLocaleDateString("fr-FR")}
      </p>

      <p>
        Alerte expiration :{" "}
        {product.expirationAlertDays} jour(s)
      </p>

      <p>
        Statut : {product.status}
      </p>

      <hr />

      <h2>Consommer le produit</h2>

      <label>
        Quantité à consommer
      </label>

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

      <button
        onClick={handleConsume}
        disabled={product.quantity === 0}
      >
        Consommer
      </button>

      <hr />

      <Link to={`/products/${product._id}/edit`}>
        Modifier
      </Link>

      <br />

      <button onClick={handleDelete}>
        Supprimer
      </button>

      <br />

      <Link to="/products">
        Retour aux produits
      </Link>
    </div>
  );
}

export default ProductDetails;