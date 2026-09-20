import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

type Category = {
  _id: string;
  name: string;
};

type Product = {
  name: string;
  category: {
    _id: string;
    name: string;
  };
  purchaseDate: string;
  expirationDate: string;
  expirationAlertDays: number;
  quantity: number;
  unit: string;
  price: number;
};

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [expirationAlertDays, setExpirationAlertDays] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("piece");
  const [price, setPrice] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    if (!id) {
      setError("Produit introuvable");
      return;
    }

    try {
      const product: Product = await getProductById(id);

      setName(product.name);
      setCategory(product.category._id);

      setPurchaseDate(
        product.purchaseDate.substring(0, 10)
      );

      setExpirationDate(
        product.expirationDate.substring(0, 10)
      );

      setExpirationAlertDays(
        product.expirationAlertDays
      );

      setQuantity(product.quantity);
      setUnit(product.unit);
      setPrice(product.price);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
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
      }
    }
  };

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
      await updateProduct(id, {
        name,
        category,
        purchaseDate,
        expirationDate,
        expirationAlertDays,
        quantity,
        unit,
        price,
      });

      setSuccess("Produit modifié avec succès");

      setTimeout(() => {
        navigate(`/products/${id}`);
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Impossible de modifier le produit");
      }
    }
  };

  return (
    <div>
      <h1>Modifier le produit</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleUpdateProduct}>
        <div>
          <label>Nom du produit</label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

        <div>
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

        <div>
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

        <div>
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

        <div>
          <label>Alerte avant expiration</label>

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

        <div>
          <label>Quantité</label>

          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(event) =>
              setQuantity(Number(event.target.value))
            }
            required
          />
        </div>

        <div>
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

        <div>
          <label>Prix (DH)</label>

          <input
            type="number"
            min="0"
            value={price}
            onChange={(event) =>
              setPrice(Number(event.target.value))
            }
            required
          />
        </div>

        <button type="submit">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}

export default EditProduct;