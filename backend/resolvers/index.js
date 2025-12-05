// src/resolvers/index.js
import authResolver from "./authResolvers.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export default {
  Query: {
    products: async () => Product.find(),
    categories: async () => {
  const products = await Product.find({}, "category");
  return [...new Set(products.map(p => p.category))];
},
    
    searchProducts: async (_, { keyword }) => {
  return Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ]
  });
},

    // ---------------- CART QUERY ----------------
    cart: async (_, __, { user, guestId }) => {
      let cart;

      // If user is logged in → use userId
      if (user) {
        cart = await Cart.findOne({ userId: user.id }).populate({
          path: "items.productId",
          model: "Product"
        });

        if (!cart) {
          cart = await Cart.create({
            userId: user.id,
            items: [],
            total: 0
          });
        }

        return cart;
      }

      // Guest cart → use guestId
      cart = await Cart.findOne({ guestId }).populate({
        path: "items.productId",
        model: "Product"
      });

      if (!cart) {
        cart = await Cart.create({
          guestId,
          items: [],
          total: 0
        });
      }

      return cart;
    }
  },

  Mutation: {
    ...authResolver.Mutation,
  }
};
