import { gql } from "apollo-server-micro";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    number: String!
    token: String
  }
`;
