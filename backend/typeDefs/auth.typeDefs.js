import { gql } from "apollo-server-micro";

export const authTypeDefs = gql`
  type TokenStatus {
    valid: Boolean!
    expired: Boolean!
    userId: ID
    name: String
    number: String
  }

  extend type Mutation {
    signup(name: String!, number: String!, password: String!): User
    login(number: String!, password: String!): User
    checkToken(token: String!): TokenStatus!
  }
`;
