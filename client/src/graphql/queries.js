import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

// 🔹 Get All Categories
export const GET_CATEGORIES = gql`
  query {
    categories
  }
`;

// 🔹 Get Saved Addresses
export const GET_ADDRESSES = gql`
  query {
    getAddresses {
      id
      name
      phone
      street
      city
      state
      zip
    }
  }
`;

// 🔹 Add New Address Mutation
export const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddressInput!) {
    addAddress(input: $input) {
      id
      name
      phone
      street
      city
      state
      zip
      createdAt
    }
  }
`;

// 🔹 Dynamic Product Search
export const SEARCH_PRODUCTS_QUERY = (fields) => gql`
  query SearchProducts($keyword: String!) {
    searchProducts(keyword: $keyword) {
      ${fields.join("\n")}
    }
  }
`;
