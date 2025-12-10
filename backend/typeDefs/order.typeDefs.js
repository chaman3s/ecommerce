import { gql } from "apollo-server-micro";

export const orderTypeDefs = gql`
  type OrderItem { productId:Product! quantity:Int! price:Float! }

  type Order {
    id:ID!
    orderId:String!
    userId:ID!
    items:[OrderItem!]!
    subTotal:Float!
    deliveryCharge:Float
    discount:Float
    totalAmount:Float!
    paymentStatus:String!
    deliveryStatus:String!
    estimatedDelivery:String
    customerName:String
    address:String
    city:String
    zipCode:String
    email:String
    phone:String
    createdAt:String
    updatedAt:String
  }

  input OrderItemInput { productId:ObjectID! quantity:Int! price:Float! }

  input PlaceOrderInput {
    orderId:String!
    items:[OrderItemInput!]!
    subTotal:Float!
    deliveryCharge:Float!
    discount:Float
    totalAmount:Float!
    paymentStatus:String!
    customerName:String
    address:String
    city:String
    zipCode:String
    email:String
    phone:String
  }

  extend type Query {
    getMyOrders:[Order!]!
    getOrder(orderId:String!):Order
  }

  extend type Mutation {
    placeOrderAfterPayment(input:PlaceOrderInput!):Order!
  }
`;
