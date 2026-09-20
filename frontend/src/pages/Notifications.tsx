import { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

import type { Notification } from "../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [selectedDate, setSelectedDate] = useState("");

  const [error, setError] = useState("");

  // Charger les notifications
  const loadNotifications = async (date?: string) => {
    try {
      setError("");

      const data = await getNotifications(date);

      setNotifications(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Impossible de charger les notifications"
        );
      }
    }
  };

  // Charger toutes les notifications au démarrage
  useEffect(() => {
    loadNotifications();
  }, []);

  // Changer la date
  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value;

    setSelectedDate(date);

    if (date) {
      loadNotifications(date);
    } else {
      loadNotifications();
    }
  };

  // Marquer une notification comme lue
  const handleMarkAsRead = async (
    notificationId: string
  ) => {
    try {
      const updatedNotification =
        await markNotificationAsRead(
          notificationId
        );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification._id === notificationId
            ? updatedNotification
            : notification
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Impossible de modifier la notification"
        );
      }
    }
  };

  // Compter les notifications non lues
  const unreadNotifications =
    notifications.filter(
      (notification) => !notification.isRead
    ).length;

  return (
    <div>
      <h1>Notifications</h1>

      {error && <p>{error}</p>}

      <p>
        Notifications non lues :{" "}
        {unreadNotifications}
      </p>

      {/* Filtre par date */}
      <div>
        <label htmlFor="notification-date">
          Choisir une date :
        </label>

        <input
          id="notification-date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <br />

      {/* Affichage des notifications */}
      {notifications.length === 0 ? (
        <p>
          Aucune notification pour cette date.
        </p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id}>
            <h3>
              {notification.product?.name ||
                "Notification"}
            </h3>

            <p>{notification.message}</p>

            {/* Date d'expiration */}
            {notification.product && (
              <p>
                Date d'expiration :{" "}
                {new Date(
                  notification.product.expirationDate
                ).toLocaleDateString("fr-FR")}
              </p>
            )}

            {/* Date de notification */}
            <p>
              Date de notification :{" "}
              {new Date(
                notification.createdAt
              ).toLocaleDateString("fr-FR")}
            </p>

            {/* Notification non lue */}
            {!notification.isRead && (
              <button
                onClick={() =>
                  handleMarkAsRead(
                    notification._id
                  )
                }
              >
                Marquer comme lue
              </button>
            )}

            {/* Notification lue */}
            {notification.isRead && (
              <p>✓ Lue</p>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;