import { gql } from "apollo-server-micro";

export const paymentTypeDefs = gql`

  type PaymentStatus {
    orderId:String!
    status:String!
    amount:Float
    referenceId:String
  }
  
  type CreateOrderResponse {
    orderId:String!
    orderToken:String!
  }

  extend type Query { verifyPayment(orderId:String!):PaymentStatus }

  extend type Mutation { 
    createCashfreeOrder(amount:Float!, customerId:ID):CreateOrderResponse!
 }
`;
