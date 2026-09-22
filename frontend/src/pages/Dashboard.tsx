import { useEffect, useState } from "react";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import {
  getMonthlyConsumption,
  getMonthlyLoss,
} from "../services/insightsService";
import "../styles/Dashboard.css";

// =========================
// Types
// =========================

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

// =========================
// Dashboard
// =========================

function Dashboard() {
  // =========================
  // Products
  // =========================

  const [products, setProducts] = useState<Product[]>([]);

  // =========================
  // Categories
  // =========================

  const [categories, setCategories] = useState<Category[]>([]);

  // =========================
  // Search and category
  // =========================

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("Tous");

  // =========================
  // Monthly Insights
  // =========================

  const [monthlyConsumption, setMonthlyConsumption] =
    useState(0);

  const [monthlyLoss, setMonthlyLoss] = useState(0);

  // =========================
  // Error
  // =========================

  const [error, setError] = useState("");

  // =========================
  // Statistics
  // =========================

  const totalProducts = products.length;

  const validProducts = products.filter(
    (product) => product.status === "valide"
  ).length;

  const expiringSoonProducts = products.filter(
    (product) => product.status === "bientot_expire"
  ).length;

  const expiredProducts = products.filter(
    (product) => product.status === "expire"
  ).length;

  // =========================
  // Expiring Soon products
  // =========================

  const expiringSoonList = products.filter(
    (product) => product.status === "bientot_expire"
  );

  // =========================
  // Expired products
  // =========================

  const expiredList = products.filter(
    (product) => product.status === "expire"
  );

  // =========================
  // Load products and categories
  // =========================

  useEffect(() => {
    const loadProductsAndCategories = async () => {
      try {
        const productsData = await getProducts();

        const categoriesData = await getCategories();

        setProducts(productsData);

        setCategories(categoriesData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Impossible de charger les données");
        }
      }
    };

    loadProductsAndCategories();
  }, []);

  // =========================
  // Load Monthly Insights
  // =========================

  useEffect(() => {
    const loadMonthlyInsights = async () => {
      try {
        const today = new Date();

        const currentYear = today.getFullYear();

        const currentMonth = today.getMonth() + 1;

        const consumptionData =
          await getMonthlyConsumption(
            currentYear,
            currentMonth
          );

        const lossData = await getMonthlyLoss(
          currentYear,
          currentMonth
        );

        setMonthlyConsumption(
          consumptionData.totalConsumed
        );

        setMonthlyLoss(lossData.totalLoss);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des statistiques:",
          error
        );
      }
    };

    loadMonthlyInsights();
  }, []);

  // =========================
  // Calculate remaining days
  // =========================

  const getDaysDifference = (
    expirationDate: string
  ) => {
    const today = new Date();

    const expiration = new Date(expirationDate);

    const difference =
      expiration.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  // =========================
  // Format date
  // =========================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // Search + Category filter
  // =========================

  const filteredProducts = products.filter(
    (product) => {
      const productName = product.name.toLowerCase();

      const searchText = search.toLowerCase();

      const matchesSearch =
        productName.includes(searchText);

      const matchesCategory =
        selectedCategory === "Tous" ||
        product.category.name === selectedCategory;

      return matchesSearch && matchesCategory;
    }
  );



  return (
  <div className="dashboard">

    <header className="dashboard-header">
      <div>
        <span className="dashboard-label">Here's your fridge Overview</span>
      </div>
    </header>


    {error && <p className="dashboard-error">{error}</p>}

    

    {/* Statistics */}
    <section className="dashboard-section">
      <div className="section-heading">
        <span>Vue générale</span>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div>
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
        </div>

        <div className="stat-card valid">
          <div className="stat-icon">✓</div>
          <div>
            <h3>Valides</h3>
            <p>{validProducts}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">◷</div>
          <div>
            <h3>Expiring Soon</h3>
            <p>{expiringSoonProducts}</p>
          </div>
        </div>

        <div className="stat-card expired">
          <div className="stat-icon">!</div>
          <div>
            <h3>Expired</h3>
            <p>{expiredProducts}</p>
          </div>
        </div>

      </div>
    </section>
    
    <div className="alerts-grid">
    {/* Expiring Soon */}
    <section className="dashboard-section alert-section expiring-section">
      <div className="section-heading">
        <h2>Expiring Soon</h2>
      </div>

      {expiringSoonList.length === 0 ? (
        <p className="empty-message">
          Aucun produit ne va bientôt expirer.
        </p>
      ) : (
        <ul className="alert-list">
          {expiringSoonList.map((product) => {
            const daysRemaining =
              getDaysDifference(product.expirationDate);

            return (
              <li className="alert-entry" key={product._id}>
                <div>
                  <span className="alert-name">{product.name}</span>
                  <span className="alert-date">
                    Expires: {formatDate(product.expirationDate)}
                  </span>
                </div>

                <span className="days-badge">
                  {daysRemaining} day
                  {daysRemaining > 1 ? "s" : ""} remaining
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
    

    {/* Expired */}
    <section className="dashboard-section alert-section expired-section">
      <div className="section-heading">
        <h2>Expired</h2>
      </div>

      {expiredList.length === 0 ? (
        <p className="empty-message">
          Aucun produit expiré.
        </p>
      ) : (
        <ul className="alert-list">
          {expiredList.map((product) => {
            const daysAgo = Math.abs(
              getDaysDifference(product.expirationDate)
            );

            return (
              <li className="alert-entry" key={product._id}>
                <div>
                  <span className="alert-name">{product.name}</span>
                  <span className="alert-date">
                    Expired: {formatDate(product.expirationDate)}
                  </span>
                </div>

                <span className="days-badge">
                  {daysAgo} day
                  {daysAgo > 1 ? "s" : ""} ago
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
    </div>

    {/* Monthly Insights */}
    <section className="dashboard-section">
      <div className="section-heading">
        <h2>Monthly Insights</h2>
        <span>Ce mois-ci</span>
      </div>

      <div className="insights-grid">

        <div className="insight-card">
          <span className="insight-label">Consumption</span>
          <strong>{monthlyConsumption}</strong>
          <span className="insight-description">
            produits consommés
          </span>
        </div>

        <div className="insight-card">
          <span className="insight-label">Food Waste</span>
          <strong>{monthlyLoss} DH</strong>
          <span className="insight-description">
            pertes alimentaires
          </span>
        </div>

      </div>
    </section>

    

    
    {/* Products */}
    <section className="dashboard-section products-section">

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      

      <div className="categories">
        <h3>Categories</h3>

        <div className="category-buttons">
          <button
            className={selectedCategory === "Tous" ? "active" : ""}
            type="button"
            onClick={() => setSelectedCategory("Tous")}
          >
            Tous
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              className={
                selectedCategory === category.name
                  ? "active"
                  : ""
              }
              type="button"
              onClick={() =>
                setSelectedCategory(category.name)
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p className="empty-message">
            Aucun produit trouvé.
          </p>
        ) : (
          filteredProducts.map((product) => (
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
                  <span>Quantité initiale</span>
                  {product.initialQuantity} {product.unit}
                </p>

                <p>
                  <span>Date d'achat</span>
                  {formatDate(product.purchaseDate)}
                </p>

                <p>
                  <span>Date d'expiration</span>
                  {formatDate(product.expirationDate)}
                </p>

                <p>
                  <span>Prix</span>
                  {product.price} DH
                </p>
              </div>

            </div>
          ))
        )}
      </div>

    </section>

  </div>
);
}
export default Dashboard;