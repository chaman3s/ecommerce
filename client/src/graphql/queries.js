import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories
  }
`;

export const SEARCH_PRODUCTS_QUERY = (fields) => gql`
  query SearchProducts($keyword: String!) {
    searchProducts(keyword: $keyword) {
      ${fields.join("\n")}
    }
  }
`;
