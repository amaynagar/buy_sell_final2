const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getProductById,
  getProductImage,
  getProducts
} = require("../controllers/product.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/images/:index", getProductImage);
router.post("/", upload.array("images", 5), createProduct);

module.exports = router;
