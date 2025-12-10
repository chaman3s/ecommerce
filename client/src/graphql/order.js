// frontend/src/graphql/order.js
import { gql } from "@apollo/client";

export const PLACE_ORDER_AFTER_PAYMENT = gql`
  mutation PlaceOrderAfterPayment($input: PlaceOrderInput!) {
    placeOrderAfterPayment(input: $input) {
      id
      orderId
      totalAmount
      paymentStatus
      deliveryStatus
      createdAt
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrder($orderId: String!) {
    getOrder(orderId: $orderId) {
      orderId
      totalAmount
      paymentStatus
      deliveryStatus
      createdAt

      customerName
      address
      city
      zipCode
      email
      phone

      items {
        quantity
        price
        productId {
          _id
          title
          thumbnail
        }
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    getMyOrders {
      orderId
      totalAmount
      paymentStatus
      deliveryStatus
      createdAt
    }
  }
`;
