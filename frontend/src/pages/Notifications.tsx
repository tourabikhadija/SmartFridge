import { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

import type { Notification } from "../services/notificationService";
import "../styles/Dashboard.css";
import "../styles/Notifications.css";

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
    <div className="dashboard notifications-page">
      <div className="notifications-container">
        <header className="dashboard-header">
          <span className="dashboard-label">
            ROCT
          </span>

          <h1>Notifications</h1>

          <p>
            Restez informé de l'état de vos
            produits
          </p>
        </header>

        {error && (
          <p className="dashboard-error">{error}</p>
        )}

        <div className="notifications-toolbar">
          <span className="notifications-unread">
            {unreadNotifications} non lue
            {unreadNotifications > 1 ? "s" : ""}
          </span>

          <div className="notifications-date-filter">
            <label htmlFor="notification-date">
              Filtrer par date
            </label>

            <input
              id="notification-date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <span className="notifications-empty-icon">
              🔔
            </span>

            <h3>Aucune notification</h3>

            <p>Vous êtes à jour.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={[
                  "notification-card",
                  `notification-${notification.type}`,
                  notification.isRead
                    ? "is-read"
                    : "is-unread",
                ].join(" ")}
              >
                <div className="notification-icon">
                  {notification.type ===
                  "welcome"
                    ? "👋"
                    : notification.type ===
                        "bientot_expire"
                      ? "◷"
                      : "!"}
                </div>

                <div className="notification-body">
                  <div className="notification-head">
                    <h3>
                      {notification.type ===
                      "welcome"
                        ? "Bienvenue"
                        : notification.type ===
                            "bientot_expire"
                          ? "Produit bientôt expiré"
                          : "Produit expiré"}
                    </h3>

                    {!notification.isRead && (
                      <span className="notification-dot" />
                    )}
                  </div>

                  <p className="notification-message">
                    {notification.message}
                  </p>

                  {notification.product && (
                    <p className="notification-expiration">
                      Expire le{" "}
                      {new Date(
                        notification.product
                          .expirationDate
                      ).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  )}

                  <div className="notification-footer">
                    <span className="notification-time">
                      {(() => {
                        const createdAt = new Date(
                          notification.createdAt
                        );
                        const now = new Date();
                        const minutes = Math.floor(
                          (now.getTime() -
                            createdAt.getTime()) /
                            (1000 * 60)
                        );
                        const hours = Math.floor(
                          minutes / 60
                        );
                        const days = Math.floor(
                          hours / 24
                        );

                        if (minutes < 1) {
                          return "À l'instant";
                        }

                        if (minutes < 60) {
                          return `Il y a ${minutes} min`;
                        }

                        if (hours < 24) {
                          return `Il y a ${hours} heure${
                            hours > 1 ? "s" : ""
                          }`;
                        }

                        return `Il y a ${days} jour${
                          days > 1 ? "s" : ""
                        }`;
                      })()}
                    </span>

                    {!notification.isRead ? (
                      <button
                        type="button"
                        className="notification-read-btn"
                        onClick={() =>
                          handleMarkAsRead(
                            notification._id
                          )
                        }
                      >
                        Marquer comme lue
                      </button>
                    ) : (
                      <span className="notification-read-label">
                        ✓ Lue
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;