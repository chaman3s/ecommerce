import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    guestId: {
      type: String,
      default: null
    },
    items: [CartItemSchema],
    total: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

CartSchema.pre("save", async function (next) {
  let total = 0;

  for (const item of this.items) {
    const product = await mongoose.model("Product").findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  this.total = total;
  next();
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
