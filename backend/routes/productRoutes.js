const express = require("express");

const router = express.Router();

const {createProduct,getProducts,getProductById,updateProduct,deleteProduct,consumeProduct,} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");

const validate = require("../middleware/validationMiddleware");

const { productSchema } = require("../validation/productValidation");

router.get("/", authMiddleware, getProducts);

router.get("/:id", authMiddleware, getProductById);

router.post("/",authMiddleware,validate(productSchema),createProduct);

router.put("/:id",authMiddleware,validate(productSchema),updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

router.patch("/:id/consume", authMiddleware, consumeProduct);

module.exports = router;