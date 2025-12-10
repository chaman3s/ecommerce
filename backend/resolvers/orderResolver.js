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
    getOrderById: async (_, { id }, { user }) => {

      if (!user) throw new Error("Login Required");

      const order = await Order.findById(id)
        .populate("items.productId"); // get product details

      if (!order) throw new Error("Order Not Found");

      // Format into address object (because schema expects object)
      const addressObj = {
        name: order.customerName,
        phone: order.phone,
        street: order.address,
        city: order.city,
        state: "-",     // your DB doesn't contain state
        zip: order.zipCode
      };

      return {
        _id: order._id,
        totalAmount: order.totalAmount,
        deliveryStatus: order.deliveryStatus,
        createdAt: order.createdAt,
        items: order.items,
        address: addressObj        // 👈 formatted properly
      };
    }
  },

  Mutation: {
    // called ONLY after payment success
    placeOrderAfterPayment: async (_, { input }, { user }) => {
      if (!user) throw new Error("Login required");
      const orderId = "order_" + Date.now();
      const {
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
        paymentStatus: "Pending",
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
      console.log("order:",order)

      return {orderId:orderId ,order};
    },
  },
};
