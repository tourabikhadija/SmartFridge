const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3001") +
  "/api/admin";

export type AdminStatistics = {
  totalUsers: number;
  totalProducts: number;
  expiredProducts: {
    _id: string;
    name: string;
    expirationDate: string;
    quantity: number;
  }[];
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

const getToken = () => {
  return localStorage.getItem("token");
};

// Statistiques
export const getAdminStatistics = async (): Promise<AdminStatistics> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/statistics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de charger les statistiques"
    );
  }

  return data;
};

// Liste des utilisateurs
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de charger les utilisateurs"
    );
  }

  return data;
};

// Activer / désactiver un utilisateur
export const toggleUserStatus = async (userId: string) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users/${userId}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de modifier le statut"
    );
  }

  return data;
};