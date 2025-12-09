import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: String,
  date: Date,
  reviewerName: String,
  reviewerEmail: String
});

const dimensionSchema = new mongoose.Schema({
  width: Number,
  height: Number,
  depth: Number
});

const metaSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  barcode: String,
  qrCode: String
});

const productSchema = new mongoose.Schema({
  id: Number,
  title: { type: String, required: true },
  description: String,
  category: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  tags: [String],
  brand: String,
  sku: String,
  weight: Number,
  dimensions: dimensionSchema,

  warrantyInformation: String,
  shippingInformation: String,
  availabilityStatus: String,
  returnPolicy: String,
  minimumOrderQuantity: Number,

  reviews: [reviewSchema],
  meta: metaSchema,

  images: [String],        // multiple gallery image list
  thumbnail: String        // single thumbnail image
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
