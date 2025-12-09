import { gql } from "@apollo/client";

export const GET_CART = gql`
  query {
    cart {
      items {
        productId {
          _id
          title
          price
          thumbnail
        }
        quantity
      }
    }
  }
`;

// ADD ITEM
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ObjectID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      items { 
        productId { _id title price thumbnail } 
        quantity 
      }
    }
  }
`;

// UPDATE QUANTITY
export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: ObjectID!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
      items { 
        productId { _id title price thumbnail } 
        quantity 
      }
    }
  }
`;

// REMOVE ITEM
export const REMOVE_ITEM = gql`
  mutation RemoveCartItem($productId: ObjectID!) {
    removeCartItem(productId: $productId) {
      items { 
        productId { _id title price thumbnail } 
        quantity 
      }
    }
  }
`;

// CLEAR CART
export const CLEAR_CART = gql`
  mutation {
    clearCart
  }
`;
