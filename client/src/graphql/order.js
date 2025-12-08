import { gql } from "@apollo/client";

export const GET_MY_ORDERS = gql`
  query {
    getMyOrders {
      id
      name
      description
      price
      imageUrl
      deliveryStatus
      deliveryDate
      totalAmount
    }
  }
`;
