import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    }
  ],

  totalAmount: Number,
  imageUrl: String,
  name: String,
  description: String,
  price: Number,

  deliveryStatus: { type: String, default: "Processing" }, // Processing → Shipped → Delivered
  deliveryDate: { type: Date },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
