import Order from "../models/Order.js";
import Product from "../models/Product.js";

export default {

  Query: {
    getMyOrders: async (_, __, { user }) => {
      if (!user) throw new Error("Login required");

      return Order.find({ userId: user.id }).sort({ createdAt: -1 });
    }
  },

  Mutation: {
    placeOrder: async (_, { productId, quantity }, { user }) => {
      if (!user) throw new Error("Login required");

      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");

      const order = await Order.create({
        userId: user.id,
        items: [{ productId, quantity }],
        imageUrl: product.imageUrl,
        name: product.name,
        description: product.description,
        price: product.price,
        totalAmount: product.price * quantity,
        deliveryStatus: "Shipped",
        deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // delivered in 4 days
      });

      return order;
    }
  }
};
