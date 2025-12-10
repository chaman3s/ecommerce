import { gql } from "@apollo/client";

export const GET_DELIVERY = gql`
  query GetDeliveryCharge($city:String!) {
    getDeliveryCharge(city:$city)
  }
`;

export const VALIDATE_COUPON = gql`
  query ValidateCoupon($code:String!, $totalAmount:Float!) {
    validateCoupon(code:$code, totalAmount:$totalAmount){
      valid
      discount
      message
    }
  }
`;
