const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3001") +
  "/api/auth";

// Type User
export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

// Register

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

// Login

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// Get Profile

export const getProfile = async (): Promise<User> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de charger le profil"
    );
  }

  return data;
};

// Update Profile

export const updateProfile = async (
  name: string,
  email: string,
  password: string
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de modifier le profil"
    );
  }

  return data;
};

// Logout

export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de se déconnecter"
    );
  }

  return data;
};