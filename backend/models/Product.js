const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  purchaseDate: {
    type: Date,
    required: true
  },

  expirationDate: {
    type: Date,
    required: true
  },

  expirationAlertDays: {
  type: Number,
  required: true,
  min: 0
 },

  quantity: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["valide", "bientot_expire", "expire"],
    default: "valide"
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;