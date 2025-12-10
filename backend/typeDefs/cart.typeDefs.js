import { gql } from "apollo-server-micro";

export const cartTypeDefs = gql`
  type CartItem {
    productId: Product!
    quantity: Int!
  }

  type Cart {
    id:ID!
    userId:ID
    guestId:String
    items:[CartItem!]!
    total:Float
    updatedAt:String
  }

  extend type Query { cart:Cart }

  extend type Mutation {
    addToCart(productId:ObjectID!, quantity:Int!):Cart
    updateCartItem(productId:ObjectID!, quantity:Int!):Cart
    removeCartItem(productId:ObjectID!):Cart
    clearCart:Boolean
  }
`;
