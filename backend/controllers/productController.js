const Product = require("../models/Product");
const Consumption = require("../models/Consumption");
const { getProductByBarcode } = require("../services/openFoodFactsService");
const Category = require("../models/Category");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      user: req.user.id,
    }).populate("category", "name");

    const productsWithStatus = products.map((product) => {
      const today = new Date();

      const expirationDate = new Date(product.expirationDate);

      const timeDifference = expirationDate - today;

      const daysRemaining = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
      );

      let productStatus;

      if (daysRemaining < 0) {
        productStatus = "expire";
      } else if (daysRemaining <= product.expirationAlertDays) {
        productStatus = "bientot_expire";
      } else {
        productStatus = "valide";
      }

      return {
        ...product.toObject(),
        status: productStatus,
      };
    });

    res.json(productsWithStatus);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const today = new Date();

    const expirationDate = new Date(product.expirationDate);

    const timeDifference = expirationDate - today;

    const daysRemaining = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
    );

    let productStatus;

    if (daysRemaining < 0) {
      productStatus = "expire";
    } else if (daysRemaining <= product.expirationAlertDays) {
      productStatus = "bientot_expire";
    } else {
      productStatus = "valide";
    }

    res.json({
      ...product.toObject(),
      status: productStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ 
      ...req.body,
    initialQuantity: req.body.quantity,
     user: req.user.id,
    });

    const today = new Date();
    const expirationDate = new Date(product.expirationDate);

    const timeDifference = expirationDate - today;

    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    let productStatus;

    if (daysRemaining < 0) {
      productStatus = "expire";
    } else if (daysRemaining <= product.expirationAlertDays) {
      productStatus = "bientot_expire";
    } else {
      productStatus = "valide";
    }

    res.status(201).json({
      ...product.toObject(),
      status: productStatus,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({
      _id: req.params.id,
    user: req.user.id,
    }, 
    req.body,
      {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const today = new Date();
    const expirationDate = new Date(product.expirationDate);

    const timeDifference = expirationDate - today;

    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    let productStatus;

    if (daysRemaining < 0) {
      productStatus = "expire";
    } else if (daysRemaining <= product.expirationAlertDays) {
      productStatus = "bientot_expire";
    } else {
      productStatus = "valide";
    }

    res.json({
      ...product.toObject(),
      status: productStatus,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const consumeProduct = async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        message: "Quantity to consume is greater than available quantity",
      });
    }

    // Calculer le prix d'une unité
    const pricePerUnit = product.price / product.initialQuantity;

    // Calculer la valeur consommée
    const amount = pricePerUnit * quantity;

    // Diminuer la quantité disponible
    product.quantity -= quantity;

    await product.save();

    // Enregistrer la consommation
    await Consumption.create({
      product: product._id,
      user: req.user.id,
      quantity,
      amount,
    });

    res.status(200).json({
      message: "Product consumed successfully",
      product,
      consumption: {
        quantity,
        amount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getProductByBarcodeController = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await getProductByBarcode(barcode);

    console.log("PRODUCT FROM SERVICE:", product);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  consumeProduct,
  getProductByBarcodeController,
};
