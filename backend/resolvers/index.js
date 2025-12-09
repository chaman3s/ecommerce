
import orderResolver from "./orderResolver.js";
import authResolver from "./authResolvers.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import addressResolver from "./addressResolver.js";
import CarouselResolver from "./carouselResolver.js";
import produtResolver from "./produtResolver.js";
import cartResolvers from "./cartResolvers.js";
export default {
  Query: {
    ...cartResolvers.Query,
    ...produtResolver.Query,
    ...addressResolver.Query ,  
    ...orderResolver.Query,
    ...CarouselResolver.Query,
  },

  Mutation: {
    ...authResolver.Mutation,
    ...addressResolver.Mutation,
    ...orderResolver.Mutation,
    ...CarouselResolver.Mutation,
    ...cartResolvers.Mutation
  }
};
