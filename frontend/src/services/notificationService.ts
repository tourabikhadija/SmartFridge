const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3001") +
  "/api/notifications";

export type Notification = {
  _id: string;
  user: string;
  product?: {
    _id: string;
    name: string;
    expirationDate: string;
  };
  message: string;
  type: "bientot_expire" | "expire" | "welcome";
  isRead: boolean;
  lastSentAt: string;
  createdAt: string;
  updatedAt: string;
};

// Récupérer les notifications
export const getNotifications = async (date?: string) => {
  const token = localStorage.getItem("token");

  let url = API_URL;

  // Si une date est sélectionnée
  if (date) {
    url = `${API_URL}?date=${date}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Impossible de charger les notifications"
    );
  }

  return data;
};

// Marquer une notification comme lue
export const markNotificationAsRead = async (
  notificationId: string
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Impossible de modifier la notification"
    );
  }

  return data;
};