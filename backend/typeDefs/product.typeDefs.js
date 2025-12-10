import { gql } from "apollo-server-micro";

export const productTypeDefs = gql`
  type Dimensions { width:Float height:Float depth:Float }
  type Review { rating:Float! comment:String date:String reviewerName:String reviewerEmail:String }

  scalar ObjectID

  type Product {
    _id: ObjectID!
    title: String!
    description: String!
    price: Float
    category: String!
    rating: Float
    stock:Int
    weight:Float
    dimensions: Dimensions
    warrantyInformation: String
    images:[String]
    thumbnail:String
    reviews:[Review]
    availabilityStatus:String
    minimumOrderQuantity:Int
    returnPolicy:String
    shippingInformation:String
  }

  extend type Query {
    products:[Product!]!
    getProduct:[Product!]!
    getProductItem(id:ObjectID!):Product
    getProductsByCategory(category:String!):[Product!]!
    categories:[String!]!
    searchProducts(keyword:String!):[Product]
  }
`;
