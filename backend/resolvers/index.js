import orderResolver from "./orderResolver.js";
import authResolver from "./authResolvers.js";
import addressResolver from "./addressResolver.js";
import CarouselResolver from "./carouselResolver.js";
import produtResolver from "./produtResolver.js";
import cartResolvers from "./cartResolvers.js";
import { objectIdScalar } from "./global.scalarResolvers.js";
import paymentResolver from "./paymentResolver.js";
import priceResolver from "./priceResolver.js";
export default {
  ObjectID: objectIdScalar.ObjectID, 
  Query: {
    ...cartResolvers.Query,
    ...produtResolver.Query,
    ...addressResolver.Query ,  
    ...orderResolver.Query,
    ...CarouselResolver.Query,
    ...paymentResolver.Query,
    ...priceResolver.Query
  },

  Mutation: {
    ...authResolver.Mutation,
    ...addressResolver.Mutation,
    ...orderResolver.Mutation,
    ...CarouselResolver.Mutation,
    ...cartResolvers.Mutation,
    ...paymentResolver.Mutation,
    ...priceResolver.Mutation
  }
};
