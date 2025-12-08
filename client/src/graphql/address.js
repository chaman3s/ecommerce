import { gql } from "@apollo/client";

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
    }
  }
`;
