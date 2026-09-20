
const cron = require("node-cron");

const Product = require("../models/Product");
const Notification = require("../models/Notification");

const checkExpiringProducts = async () => {
  console.log("CHECK EXPIRATION FUNCTION RUNNING");

  try {
    const products = await Product.find();
    const today = new Date();

    for (const product of products) {
      // Produit consommé بالكامل
      if (product.quantity <= 0) {
        continue;
      }

      const expirationDate = new Date(product.expirationDate);

      const timeDifference = expirationDate - today;

      const daysRemaining = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
      );

      // =================================
      // PRODUIT BIENTÔT EXPIRÉ
      // =================================

      if (
        daysRemaining >= 0 &&
        daysRemaining <= product.expirationAlertDays
      ) {
        const notification = await Notification.findOne({
          user: product.user,
          product: product._id,
          type: "bientot_expire",
        }).sort({ createdAt: -1 });

        // Première notification
        if (!notification) {
          await Notification.create({
            user: product.user,
            product: product._id,
            type: "bientot_expire",
            message:
              `${product.name} expire dans ` +
              `${daysRemaining} jour(s).`,
            isRead: false,
            lastSentAt: today,
          });

          continue;
        }

        // User a déjà lu la notification
        // On arrête définitivement les rappels
        if (notification.isRead) {
          continue;
        }

        // Vérifier le temps depuis la dernière notification
        const lastSentAt = new Date(notification.lastSentAt);

        const hoursPassed =
          (today - lastSentAt) / (1000 * 60 * 60);

        // Après 24 heures :
        // on UPDATE la même notification
        if (hoursPassed >= 24) {
          notification.message =
            `${product.name} expire dans ` +
            `${daysRemaining} jour(s).`;

          notification.lastSentAt = today;

          await notification.save();
        }
      }

      // =================================
      // PRODUIT EXPIRÉ
      // =================================

      else if (daysRemaining < 0) {
        const notification = await Notification.findOne({
          user: product.user,
          product: product._id,
          type: "expire",
        });

        // Notification expirée une seule fois
        if (!notification) {
          await Notification.create({
            user: product.user,
            product: product._id,
            type: "expire",
            message: `${product.name} est expiré.`,
            isRead: false,
            lastSentAt: today,
          });
        }
      }
    }

    console.log(
      "Vérification des notifications terminée."
    );
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des notifications :",
      error.message
    );
  }
};

// Vérifier une fois par jour à 00:00
cron.schedule("0 0 * * *", () => {
  checkExpiringProducts();
});

module.exports = {
  checkExpiringProducts,
};