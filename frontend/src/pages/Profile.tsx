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
    <div>
      <h1>My Profile</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      {/* Profile */}
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>

        <div>
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

        <div>
          <label htmlFor="role">Role</label>

          <input
            id="role"
            type="text"
            value={role}
            disabled
          />
        </div>

        <div>
          <label htmlFor="password">
            Current password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Required to change email"
          />
        </div>

        <button type="submit">
          Save changes
        </button>
      </form>

      <br />

      {/* Admin */}
      {role === "admin" && (
        <div>
          <hr />

          <h2>Administration</h2>

          {/* Statistics */}
          <h3>Statistics</h3>

          <p>
            Registered users: {totalUsers}
          </p>

          <p>
            Registered products: {totalProducts}
          </p>

          {/* Expired products */}
          <h3>Expired products</h3>

          {expiredProducts.length === 0 ? (
            <p>No expired products.</p>
          ) : (
            expiredProducts.map((product) => (
              <div key={product._id}>
                <p>
                  <strong>{product.name}</strong>
                </p>

                <p>
                  Expiration date:{" "}
                  {new Date(
                    product.expirationDate
                  ).toLocaleDateString("fr-FR")}
                </p>

                <p>
                  Quantity: {product.quantity}
                </p>

                <hr />
              </div>
            ))
          )}

          {/* Users */}
          <h3>User management</h3>

          {users.length === 0 ? (
            <p>No users.</p>
          ) : (
            users.map((user) => (
              <div key={user._id}>
                <p>
                  <strong>{user.name}</strong>
                </p>

                <p>{user.email}</p>

                <p>
                  Role: {user.role}
                </p>

                <p>
                  Status:{" "}
                  {user.isActive
                    ? "Active"
                    : "Disabled"}
                </p>

                <button
                  onClick={() =>
                    handleToggleUser(user._id)
                  }
                >
                  {user.isActive
                    ? "Disable"
                    : "Enable"}
                </button>

                <hr />
              </div>
            ))
          )}

          {/* Categories */}
          <h3>Category management</h3>

          <div>
            <input
              type="text"
              value={searchCategory}
              onChange={(event) =>
                setSearchCategory(
                  event.target.value
                )
              }
              placeholder="Search category"
            />
          </div>

          <br />

          <div>
            <input
              type="text"
              value={categoryName}
              onChange={(event) =>
                setCategoryName(
                  event.target.value
                )
              }
              placeholder="Category name"
            />

            <button onClick={handleAddCategory}>
              Add category
            </button>
          </div>

          <br />

          {filteredCategories.length === 0 ? (
            <p>No category found.</p>
          ) : (
            filteredCategories.map((category) => (
              <div key={category._id}>
                <strong>{category.name}</strong>

                <button
                  onClick={() =>
                    handleEditCategory(
                      category._id,
                      category.name
                    )
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDeleteCategory(
                      category._id
                    )
                  }
                >
                  Delete
                </button>

                <hr />
              </div>
            ))
          )}
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;