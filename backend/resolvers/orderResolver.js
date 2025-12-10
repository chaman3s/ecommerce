import Order from "../models/Order.js";
import Product from "../models/Product.js";

export default {
  Query: {
    getMyOrders: async (_, __, { user }) => {
      if (!user) throw new Error("Login required");
      return Order.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .populate("items.productId");
    },

    getOrder: async (_, { orderId }, { user }) => {
      if (!user) throw new Error("Login required");
      return Order.findOne({ orderId, userId: user.id }).populate(
        "items.productId"
      );
    },
  },

  Mutation: {
    // called ONLY after payment success
    placeOrderAfterPayment: async (_, { input }, { user }) => {
      if (!user) throw new Error("Login required");

      const {
        orderId,
        items,
        subTotal,
        deliveryCharge,
        discount = 0,
        totalAmount,
        paymentStatus,
        customerName,
        address,
        city,
        zipCode,
        email,
        phone,
      } = input;

      if (paymentStatus !== "PAID") {
        throw new Error("Payment not completed");
      }

      // Optional: verify products & prices
      for (const item of items) {
        const p = await Product.findById(item.productId);
        if (!p) throw new Error("Product not found: " + item.productId);
        // you can compare p.price with item.price if you want
      }

      const order = await Order.create({
        userId: user.id,
        orderId,
        items,
        subTotal,
        deliveryCharge,
        discount,
        totalAmount,
        paymentStatus: "PAID",
        deliveryStatus: "Processing",
        estimatedDelivery: new Date(
          Date.now() + 4 * 24 * 60 * 60 * 1000
        ), // +4 days
        customerName,
        address,
        city,
        zipCode,
        email,
        phone,
      });

      return order;
    },
  },
};
