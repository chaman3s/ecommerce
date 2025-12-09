import { gql } from "@apollo/client";
export const GET_Product = gql`
query {
    getProduct{
      id
      title
      description
      category
      price
      rating
      stock
      thumbnail
    }
}`;
export const GET_ProductById = gql`
query($id: ID!) {
    getProductItem(id: $id) {
      id
      title
      description
      category
      price
      rating
      stock
      thumbnail
    }
}
`;
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query($category: String!) {
    getProductsByCategory(category: $category) {
      id
      title
      thumbnail
      price
      stock
      rating
      category
      minimumOrderQuantity
      shippingInformation
    }
  }
`;