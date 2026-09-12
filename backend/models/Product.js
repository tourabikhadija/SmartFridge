const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Category",
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

  initialQuantity: {
  type: Number,
  required: true,
  min: 1,
},

  unit: {
    type: String,
    enum: ["piece", "kg", "g", "l", "ml"],
    default: "piece"
  },

  price: {
   type: Number,
   required: true,
   min: 0,
  },


  status: {
    type: String,
    enum: ["valide", "bientot_expire", "expire"],
    default: "valide"
  },
  
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;