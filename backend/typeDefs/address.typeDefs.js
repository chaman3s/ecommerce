import { gql } from "apollo-server-micro";

export const addressTypeDefs = gql`
  type Address {
    id:ID!
    name:String!
    phone:String!
    street:String!
    city:String
    state:String
    zip:String
    createdAt:String
    updatedAt:String
  }

  input AddressInput {
    name:String!
    phone:String!
    street:String!
    city:String
    state:String
    zip:String
  }

  extend type Query { getAddresses:[Address!] }

  extend type Mutation {
    addAddress(input:AddressInput!):Address!
    updateAddress(id:ID!, input:AddressInput!):Address!
    deleteAddress(id:ID!):String!
  }
`;
