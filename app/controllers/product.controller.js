const Product = require("../models/product.model");
const {
  CATEGORY_KEYWORDS,
  classifyImage,
  imageMatchesCategory
} = require("../services/imageClassifier.service");

function toResponseProduct(productDoc) {
  const product = productDoc.toObject();
  const images = (product.images || []).map((_, index) => `/api/products/${product._id}/images/${index}`);

  return {
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    category: product.category,
    owner: product.owner,
    description: product.description,
    images,
    reviews: product.reviews || []
  };
}

async function getProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products.map(toResponseProduct));
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(toResponseProduct(product));
  } catch (error) {
    return next(error);
  }
}

async function getProductImage(req, res, next) {
  try {
    const { id, index } = req.params;
    const imageIndex = Number(index);
    const product = await Product.findById(id).select("images");

    if (!product || !product.images || !product.images[imageIndex]) {
      return res.status(404).json({ message: "Image not found" });
    }

    const image = product.images[imageIndex];
    res.set("Content-Type", image.contentType || "application/octet-stream");
    return res.send(image.data);
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, price, category, owner, description } = req.body;
    const normalizedCategory = String(category || "").toLowerCase().trim();
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    const unsupportedCategory = !Object.prototype.hasOwnProperty.call(CATEGORY_KEYWORDS, normalizedCategory);
    if (unsupportedCategory) {
      return res.status(400).json({ message: "Invalid category selected." });
    }

    for (const file of files) {
      const mime = String(file.mimetype || "").toLowerCase();
      const supported = mime.includes("jpeg") || mime.includes("jpg") || mime.includes("png");

      if (!supported) {
        return res.status(400).json({ message: "Only JPG and PNG images are supported for AI category verification." });
      }

      const predictions = await classifyImage(file.buffer, file.mimetype);
      if (!imageMatchesCategory(predictions, normalizedCategory)) {
        return res.status(400).json({
          message: `Uploaded image does not match category \"${normalizedCategory}\".`,
          predictions: predictions.map((prediction) => ({
            label: prediction.className,
            probability: Number(prediction.probability.toFixed(4))
          }))
        });
      }
    }

    const imageDocs = files.map((file) => ({
      filename: file.originalname,
      contentType: file.mimetype,
      data: file.buffer
    }));

    const newProduct = await Product.create({
      name,
      price,
      category: normalizedCategory,
      owner,
      description,
      images: imageDocs,
      reviews: []
    });

    return res.status(201).json(toResponseProduct(newProduct));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  getProductById,
  getProductImage,
  getProducts
};
