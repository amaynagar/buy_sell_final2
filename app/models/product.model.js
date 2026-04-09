const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    filename: String,
    contentType: String,
    data: Buffer
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: String, required: true },
    description: { type: String, default: "" },
    images: [imageSchema],
    reviews: { type: Array, default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
