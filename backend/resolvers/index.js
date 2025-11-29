// src/resolvers/index.js
import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export default {
  Query: {
    users: async () => User.find(),
    products: async () => Product.find(),
    categories: async () => {
  const products = await Product.find({}, "category");
  return [...new Set(products.map(p => p.category))];
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
    register: async (_, { input }) => {
      const { name, email, password } = input;

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashed,
      });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user),
      };
    }
  }
};
