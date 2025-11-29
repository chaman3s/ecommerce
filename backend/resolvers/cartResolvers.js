import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export default {
  Query: {
    cart: async (_parent, _args, { user, guestId }) => {
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
  }
};
