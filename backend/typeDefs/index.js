import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from "./user.typeDefs.js";
import { authTypeDefs } from "./auth.typeDefs.js";
import { productTypeDefs } from "./product.typeDefs.js";
import { cartTypeDefs } from "./cart.typeDefs.js";
import { addressTypeDefs } from "./address.typeDefs.js";
import { carouselTypeDefs } from "./carousel.typeDefs.js";
import { orderTypeDefs } from "./order.typeDefs.js";
import { paymentTypeDefs } from "./payment.typeDefs.js";
import { globalScalars } from "./global.scalars.js";
import { baseTypeDefs } from "../resolvers/base.schema.js";
import priceTypeDefs from "./price.typeDefs.js";

export default mergeTypeDefs([
 
  baseTypeDefs,
  globalScalars,
  userTypeDefs,
  authTypeDefs,
  productTypeDefs,
  cartTypeDefs,
  addressTypeDefs,
  carouselTypeDefs,
  orderTypeDefs,
  paymentTypeDefs,
  priceTypeDefs
]);
