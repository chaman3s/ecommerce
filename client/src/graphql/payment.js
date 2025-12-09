import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateCashfreeOrder($amount: Float!, $customerId: ID) {
    createCashfreeOrder(amount: $amount, customerId: $customerId) {
      orderId
      orderToken
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  query VerifyPayment($orderId: String!) {
    verifyPayment(orderId: $orderId) {
      orderId
      status
      amount
    }
  }
`;
