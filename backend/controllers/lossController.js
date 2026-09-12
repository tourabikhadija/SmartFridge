const Product = require("../models/Product");

const getMonthlyLoss = async (req, res) => {
  try {
    const { year, month } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const products = await Product.find({
      user: req.user.id,
      expirationDate: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    let totalLoss = 0;

    products.forEach((product) => {
      const today = new Date();
      const expirationDate = new Date(product.expirationDate);

      // On compte seulement les produits déjà expirés
      if (expirationDate < today) {
        const pricePerUnit =
          product.price / product.initialQuantity;

        const lossAmount =
          pricePerUnit * product.quantity;

        totalLoss += lossAmount;
      }
    });

    res.status(200).json({
      year: Number(year),
      month: Number(month),
      totalLoss,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMonthlyLoss,
};