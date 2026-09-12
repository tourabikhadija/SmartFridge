const Consumption = require("../models/Consumption");

const getMonthlyConsumption = async (req, res) => {
  try {
    const { year, month } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const consumptions = await Consumption.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const totalAmount = consumptions.reduce(
      (total, consumption) => total + consumption.amount,
      0
    );

    res.status(200).json({
      year: Number(year),
      month: Number(month),
      totalConsumed: totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMonthlyConsumption,
};