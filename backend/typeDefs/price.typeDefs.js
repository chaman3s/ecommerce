import { gql } from "apollo-server-micro";

export default gql`
    #Coupon Object
  type Coupon {
    code: String!
    type: String!          # PERCENT | FLAT
    value: Float!
    minOrderAmount: Float
    maxDiscount: Float
    expiry: String
    status: Boolean
  }
  # City Delivery Cost
  type DeliveryRate {
    city: String!
    charge: Float!
  }
  # Price Model (Full Object)
  type Price {
    id: ID!
    deliveryRates: [DeliveryRate]
    defaultDelivery: Float
    coupons: [Coupon]
    createdAt: String
    updatedAt: String
  }
  # Responses
  # Response when coupon is checked
  type CouponResponse {
    valid: Boolean!
    discount: Float!
    message: String!
  }
  # Queries
  extend type Query {
    getPriceSettings: Price
    getDeliveryCharge(city:String!): Float
    validateCoupon(code:String!, totalAmount:Float!): CouponResponse
  }
  # Mutations — Delivery Rates
   extend type Mutation {
    addCityDeliveryCharge(city:String!, charge:Float!): Price
    updateCityDeliveryCharge(city:String!, charge:Float!): Price
    deleteCityDeliveryCharge(city:String!): Price
    # Mutations — Coupons
    addCoupon(input: CouponInput!): Price
    updateCoupon(code:String!, input:CouponInput!): Price
    deleteCoupon(code:String!): Price
  }
  # Inputs
  input CouponInput {
    code: String!
    type: String!        # PERCENT | FLAT
    value: Float!
    minOrderAmount: Float
    maxDiscount: Float
    expiry: String
    status: Boolean
  }
`;
