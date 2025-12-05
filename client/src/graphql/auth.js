import { gql } from "@apollo/client";

/* SIGNUP MUTATION */
export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $number: String!, $password: String!) {
    signup(name: $name, number: $number, password: $password) {
      id
      name
      number
      token
    }
  }
`;

/* LOGIN MUTATION */
export const LOGIN_MUTATION = gql`
  mutation Login($number: String!, $password: String!) {
    login(number: $number, password: $password) {
      id
      name
      number
      token
    }
  }
`;
