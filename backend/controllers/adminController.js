const User = require("../models/User");
const Product = require("../models/Product");

const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const expiredProducts = await Product.find({
      expirationDate: { $lt: new Date() },
    })
      .select("name expirationDate quantity")
      .sort({ expirationDate: 1 });

    res.status(200).json({
      totalUsers,
      totalProducts,
      expiredProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: user.isActive
        ? "User activated"
        : "User deactivated",
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStatistics,
   getUsers,
  toggleUserStatus,
};