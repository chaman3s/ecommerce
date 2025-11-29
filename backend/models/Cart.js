import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export default {
  Query: {
    users: async () => User.find(),
    products: async () => Product.find(),

    // CART QUERY
    cart: async (_, __, { user, guestId }) => {
      let cart;

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

      // Guest cart
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
    // ============= REGISTER USER =============
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
    },

    // ============= ADD TO CART =============
    addToCart: async (_, { productId, quantity }, { user, guestId }) => {
      let cart;

      if (user) {
        cart = await Cart.findOne({ userId: user.id });
        if (!cart) cart = await Cart.create({ userId: user.id, items: [] });
      } else {
        cart = await Cart.findOne({ guestId });
        if (!cart) cart = await Cart.create({ guestId, items: [] });
      }

      const existing = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
      return cart.populate("items.productId");
    },

    // ============= UPDATE CART ITEM =============
    updateCartItem: async (_, { productId, quantity }, { user, guestId }) => {
      let cart;

      if (user) {
        cart = await Cart.findOne({ userId: user.id });
      } else {
        cart = await Cart.findOne({ guestId });
      }

      if (!cart) throw new Error("Cart not found");

      const item = cart.items.find(
        (i) => i.productId.toString() === productId
      );

      if (!item) throw new Error("Item not found in cart");

      if (quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.productId.toString() !== productId
        );
      } else {
        item.quantity = quantity;
      }

      await cart.save();
      return cart.populate("items.productId");
    },

    // ============= REMOVE CART ITEM =============
    removeCartItem: async (_, { productId }, { user, guestId }) => {
      let cart;

      if (user) {
        cart = await Cart.findOne({ userId: user.id });
      } else {
        cart = await Cart.findOne({ guestId });
      }

      if (!cart) throw new Error("Cart not found");

      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );

      await cart.save();
      return cart.populate("items.productId");
    },

    // ============= CLEAR CART =============
    clearCart: async (_, __, { user, guestId }) => {
      let cart;

      if (user) {
        cart = await Cart.findOne({ userId: user.id });
      } else {
        cart = await Cart.findOne({ guestId });
      }

      if (!cart) return true;

      cart.items = [];
      await cart.save();
      return true;
    }
  }
};
