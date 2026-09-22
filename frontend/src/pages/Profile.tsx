import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProfile,
  updateProfile,
  logoutUser,
} from "../services/authService";

import {
  getAdminStatistics,
  getAdminUsers,
  toggleUserStatus,
} from "../services/adminService";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import type { Category } from "../services/categoryService";
import "../styles/Dashboard.css";
import "../styles/Products.css";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  // Profile information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  // Messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Admin statistics
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [expiredProducts, setExpiredProducts] = useState<any[]>([]);

  // Users
  const [users, setUsers] = useState<any[]>([]);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getProfile();

        setName(user.name);
        setEmail(user.email);
        setRole(user.role);

        if (user.role === "admin") {
          await loadAdminData();
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unable to load profile");
        }
      }
    };

    loadProfile();
  }, []);

  // Load admin data
  const loadAdminData = async () => {
    try {
      const statistics = await getAdminStatistics();
      const adminUsers = await getAdminUsers();
      const adminCategories = await getCategories();

      setTotalUsers(statistics.totalUsers);
      setTotalProducts(statistics.totalProducts);
      setExpiredProducts(statistics.expiredProducts);
      setUsers(adminUsers);
      setCategories(adminCategories);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to load admin data");
      }
    }
  };

  // Update profile
  const handleUpdate = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      const updatedUser = await updateProfile(
        name,
        email,
        password
      );

      setName(updatedUser.user.name);
      setEmail(updatedUser.user.email);

      setPassword("");

      setMessage("Profile updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to update profile");
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to logout");
      }
    }
  };

  // Activate / deactivate user
  const handleToggleUser = async (
    userId: string
  ) => {
    try {
      setError("");
      setMessage("");

      await toggleUserStatus(userId);

      const adminUsers = await getAdminUsers();

      setUsers(adminUsers);

      const statistics = await getAdminStatistics();

      setTotalUsers(statistics.totalUsers);
      setTotalProducts(statistics.totalProducts);
      setExpiredProducts(statistics.expiredProducts);

      setMessage("User status updated");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to update user status");
      }
    }
  };

  // Add category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setError("");
      setMessage("");

      const newCategory = await createCategory(
        categoryName.trim()
      );

      setCategories((currentCategories) => [
        ...currentCategories,
        newCategory,
      ]);

      setCategoryName("");

      setMessage("Category created successfully");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to create category");
      }
    }
  };

  // Edit category
  const handleEditCategory = async (
    categoryId: string,
    currentName: string
  ) => {
    const newName = window.prompt(
      "Enter the new category name:",
      currentName
    );

    if (!newName || !newName.trim()) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const updatedCategory = await updateCategory(
        categoryId,
        newName.trim()
      );

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category._id === categoryId
            ? updatedCategory
            : category
        )
      );

      setMessage("Category updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to update category");
      }
    }
  };

  // Delete category
  const handleDeleteCategory = async (
    categoryId: string
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteCategory(categoryId);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category._id !== categoryId
        )
      );

      setMessage("Category deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to delete category");
      }
    }
  };

  // Search categories
  const filteredCategories = categories.filter(
    (category) =>
      category.name
        .toLowerCase()
        .includes(searchCategory.toLowerCase())
  );

  return (
    <div className="dashboard profile-page">
      <div className="profile-container">
        <header className="dashboard-header">
          <span className="dashboard-label">
            ROCT
          </span>

          <h1>Mon profil</h1>

          <p>
            Gérez vos informations personnelles
          </p>
        </header>

        {error && (
          <p className="dashboard-error">{error}</p>
        )}

        {message && (
          <p className="dashboard-success">
            {message}
          </p>
        )}

        {/* Carte de profil */}
        <section className="dashboard-section">
          <div className="profile-card">
            <div className="profile-avatar">👤</div>

            <h2>{name}</h2>

            <p>{email}</p>

            <span className="profile-role-badge">
              {role}
            </span>
          </div>
        </section>

        {/* Blocs d'informations */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Mes informations</h2>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-block">
              <span className="profile-info-label">
                Nom
              </span>

              <strong>{name}</strong>
            </div>

            <div className="profile-info-block">
              <span className="profile-info-label">
                Email
              </span>

              <strong>{email}</strong>
            </div>

            <div className="profile-info-block">
              <span className="profile-info-label">
                Rôle
              </span>

              <strong>{role}</strong>
            </div>
          </div>
        </section>

        {/* Formulaire de modification */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Modifier mes informations</h2>
          </div>

          <form
            className="profile-edit-card"
            onSubmit={handleUpdate}
          >
            <div className="profile-edit-grid">
              <div className="products-field">
                <label htmlFor="name">Nom</label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                />
              </div>

              <div className="products-field">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </div>

              <div className="products-field">
                <label htmlFor="role">Rôle</label>

                <input
                  id="role"
                  type="text"
                  value={role}
                  disabled
                />
              </div>

              <div className="products-field">
                <label htmlFor="password">
                  Mot de passe actuel
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Requis pour changer l'email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="products-btn products-btn-primary"
            >
              Enregistrer les modifications
            </button>
          </form>
        </section>

        {/* Administration */}
        {role === "admin" && (
          <section className="dashboard-section">
            <div className="section-heading">
              <h2>Administration</h2>
            </div>

            {/* Statistiques */}
            <div className="profile-admin-grid">
              <div className="profile-stat-card">
                <span className="profile-stat-icon">
                  👥
                </span>

                <div>
                  <h3>Utilisateurs inscrits</h3>

                  <p>{totalUsers}</p>
                </div>
              </div>

              <div className="profile-stat-card">
                <span className="profile-stat-icon">
                  📦
                </span>

                <div>
                  <h3>Produits enregistrés</h3>

                  <p>{totalProducts}</p>
                </div>
              </div>

              <div className="profile-stat-card">
                <span className="profile-stat-icon">
                  ⚠️
                </span>

                <div>
                  <h3>Produits expirés</h3>

                  <p>{expiredProducts.length}</p>
                </div>
              </div>
            </div>

            {/* Produits expirés */}
            <div className="section-heading profile-subheading">
              <h3>Produits expirés</h3>
            </div>

            {expiredProducts.length === 0 ? (
              <p className="empty-message">
                Aucun produit expiré.
              </p>
            ) : (
              <div className="profile-list">
                {expiredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="profile-list-item"
                  >
                    <div className="profile-list-info">
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        Expire le{" "}
                        {new Date(
                          product.expirationDate
                        ).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        · Quantité :{" "}
                        {product.quantity}
                      </span>
                    </div>

                    <span className="profile-badge danger">
                      Expiré
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Utilisateurs */}
            <div className="section-heading profile-subheading">
              <h3>Gestion des utilisateurs</h3>
            </div>

            {users.length === 0 ? (
              <p className="empty-message">
                Aucun utilisateur.
              </p>
            ) : (
              <div className="profile-list">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="profile-list-item"
                  >
                    <div className="profile-list-info">
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email} · {user.role}{" "}
                        ·{" "}
                        {user.isActive
                          ? "Actif"
                          : "Désactivé"}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={
                        user.isActive
                          ? "products-btn products-btn-danger"
                          : "products-btn products-btn-primary"
                      }
                      onClick={() =>
                        handleToggleUser(user._id)
                      }
                    >
                      {user.isActive
                        ? "Désactiver"
                        : "Activer"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Catégories */}
            <div className="section-heading profile-subheading">
              <h3>Gestion des catégories</h3>
            </div>

            <div className="profile-categories-controls">
              <input
                type="text"
                value={searchCategory}
                onChange={(event) =>
                  setSearchCategory(
                    event.target.value
                  )
                }
                placeholder="Rechercher une catégorie"
              />

              <div className="profile-categories-add">
                <input
                  type="text"
                  value={categoryName}
                  onChange={(event) =>
                    setCategoryName(
                      event.target.value
                    )
                  }
                  placeholder="Nom de la catégorie"
                />

                <button
                  type="button"
                  className="products-btn products-btn-primary"
                  onClick={handleAddCategory}
                >
                  Ajouter
                </button>
              </div>
            </div>

            {filteredCategories.length === 0 ? (
              <p className="empty-message">
                Aucune catégorie trouvée.
              </p>
            ) : (
              <div className="profile-list">
                {filteredCategories.map((category) => (
                  <div
                    key={category._id}
                    className="profile-list-item"
                  >
                    <div className="profile-list-info">
                      <strong>
                        {category.name}
                      </strong>
                    </div>

                    <div className="profile-list-actions">
                      <button
                        type="button"
                        className="products-btn"
                        onClick={() =>
                          handleEditCategory(
                            category._id,
                            category.name
                          )
                        }
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        className="products-btn products-btn-danger"
                        onClick={() =>
                          handleDeleteCategory(
                            category._id
                          )
                        }
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Déconnexion */}
        <button
          type="button"
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default Profile;