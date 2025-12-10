import { gql } from "@apollo/client";
export const GET_Product = gql`
query {
    getProduct{
      _id
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
query  GetProduct ($id: ObjectID!) {
    getProductItem(id: $id) {
      _id
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
export const GET_PRODUCT_IMAGE = gql`
  query GetProductImage($id: ObjectID!) {
    getProductItem(id: $id) {
      thumbnail
    }
  }
`;