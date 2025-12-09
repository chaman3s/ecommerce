const typeDefs = `#graphql
type User {
  id: ID!
  name: String!
  number: String!
  token: String
}
  type Dimensions {
  width: Float
  height: Float
  depth: Float
}
type Review {
  rating: Float!
  comment: String
  date: String
  reviewerName: String
  reviewerEmail: String
}

  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float
    category: String!
    rating: Float,
    stock:Int,
    weight:Float,
    dimensions: Dimensions
    warrantyInformation: String
    images: [String]
    thumbnail: String
    reviews: [Review]
    availabilityStatus: String
    minimumOrderQuantity: Int
    returnPolicy: String
    shippingInformation: String
  }

  type Cart {
    id: ID!
    userId: ID
    guestId: String
    items: [CartItem!]!
    total: Float!
    updatedAt: String
  }
  

  type CartItem {
    product: Product!
    quantity: Int!
  }
  type Address {
    id: ID!
    name: String!
    phone: String!
    street: String!
    city: String
    state: String
    zip: String
    createdAt: String
    updatedAt: String
  }
 input AddressInput {
    name: String!
    phone: String!
    street: String!
    city: String
    state: String
    zip: String
  }

  
  type Order {
  id: ID!
  name: String!
  description: String
  price: Float!
  imageUrl: String
  deliveryStatus: String!
  deliveryDate: String
  totalAmount: Float
}

extend type Query {
  getMyOrders: [Order]
}

extend type Mutation {
  placeOrder(productId: ID!, quantity: Int!): Order
}
type Order {
  id: ID!
  name: String!
  description: String
  price: Float!
  imageUrl: String
  deliveryStatus: String!
  deliveryDate: String
  totalAmount: Float
}
type CarouselItem {
    id: ID!
    title: String!
    description: String!
    image: String!
  }
  input CarouselInput {
    title: String!
    description: String!
    image: String!
  }



  type Query {
    users: [User]
    getProduct: [Product!]!
    getProductItem(id:ID!):Product
    getProductsByCategory(category: String!): [Product!]!
    categories: [String!]!  
    searchProducts(keyword: String!): [Product]     # FIXED: return ONE cart, not array
    getCarousel: [CarouselItem!]!
    getCarouselItem(id: ID!): CarouselItem
    cart: Cart  
  }
  
  extend type Query {
    getAddresses: [Address!]
    getMyOrders: [Order]
  }

 
type Mutation {
  signup(name: String!, number: String!, password: String!): User
  login(number: String!, password: String!): User
  placeOrder(productId: ID!, quantity: Int!): Order
   addCarouselItem(input: CarouselInput): CarouselItem
}
extend type Mutation {
    addAddress(input: AddressInput!): Address!
    updateAddress(id: ID!, input: AddressInput!): Address!
    deleteAddress(id: ID!): String!
  }

`;
 

  

export default typeDefs;
