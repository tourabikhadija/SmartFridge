const Notification = require("../models/Notification");
const Product = require("../models/Product");

// Get notifications for the logged-in user
const getNotifications = async (req, res) => {
  try {
    const { date } = req.query;

    const filter = {
      user: req.user.id,
    };

    // Filtrer par jour si une date est envoyée
    if (date) {
      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(`${date}T23:59:59.999Z`);

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const notifications = await Notification.find(filter)
      .populate("product", "name expirationDate")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        isRead: true,
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};