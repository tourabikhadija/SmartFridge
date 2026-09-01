const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });

    const productsWithStatus = products.map((product) => {
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
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ 
      ...req.body,
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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
