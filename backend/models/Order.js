// backend/models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true, // snapshot of product price at order time
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Cashfree order id
    orderId: {
      type: String,
      required: true,
    },

    items: [orderItemSchema],

    // price summary
    subTotal: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // payment
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed","Not Found"],
      default: "Pending",
    },

    // delivery
    deliveryStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    estimatedDelivery: {
      type: Date,
    },

    // basic shipping snapshot (optional)
    customerName: String,
    address: String,
    city: String,
    zipCode: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
