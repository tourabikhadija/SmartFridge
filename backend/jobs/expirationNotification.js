const cron = require("node-cron");

const Product = require("../models/Product");
const Notification = require("../models/Notification");

const checkExpiringProducts = async () => {
  try {
    const products = await Product.find();
    const today = new Date();

    for (const product of products) {
      const expirationDate = new Date(product.expirationDate);

      const difference = expirationDate - today;

      const daysLeft = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

      // Mise à jour du status du produit
      if (daysLeft < 0) {
        product.status = "expire";
      } else if (daysLeft <= product.expirationAlertDays) {
        product.status = "bientot_expire";
      } else {
        product.status = "valide";
      }

      await product.save();

      // Produit expiré
      if (daysLeft < 0) {
        await createNotification(
          product,
          "expire",
          `${product.name} est expiré.`
        );
      }

      // Produit bientôt expiré
      else if (daysLeft <= product.expirationAlertDays) {
        await createNotification(
          product,
          "bientot_expire",
          `${product.name} expire dans ${daysLeft} jour(s).`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const createNotification = async (product, type, message) => {
  const notification = await Notification.findOne({
    product: product._id,
    type: type,
  });

  // ما عندناش notification من قبل
  if (!notification) {
    await Notification.create({
      user: product.user,
      product: product._id,
      message: message,
      type: type,
      isRead: false,
      lastSentAt: new Date(),
    });

    console.log(`Notification créée pour ${product.name}`);
    return;
  }

  // إلا user قرا notification، ما نعاودوش نرسل
  if (notification.isRead) {
    return;
  }

  // نشوفو واش دازت ساعة
  const oneHour = 60 * 60 * 1000;
  const timePassed = new Date() - notification.lastSentAt;

  if (timePassed >= oneHour) {
    await Notification.create({
      user: product.user,
      product: product._id,
      message: message,
      type: type,
      isRead: false,
      lastSentAt: new Date(),
    });

    console.log(`Notification répétée pour ${product.name}`);
  }
};

// Test : كل دقيقة
cron.schedule("* * * * *", () => {
  console.log("Vérification des produits...");
  checkExpiringProducts();
});

module.exports = checkExpiringProducts;