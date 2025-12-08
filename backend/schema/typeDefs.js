const typeDefs = `#graphql
type User {
  id: ID!
  name: String!
  number: String!
  token: String
}

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
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
  
  # ------------------- QUERIES -------------------
  
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




  type Query {
    users: [User]
    products: [Product]
    cart: Cart  
    categories: [String!]!  
     searchProducts(keyword: String!): [Product]     # FIXED: return ONE cart, not array
  }
  extend type Query {
    getAddresses: [Address!]
    getMyOrders: [Order]
  }

  # ------------------- INPUTS -------------------


  # ------------------- MUTATIONS -------------------
type Mutation {
  signup(name: String!, number: String!, password: String!): User
  login(number: String!, password: String!): User
  placeOrder(productId: ID!, quantity: Int!): Order
}
extend type Mutation {
    addAddress(input: AddressInput!): Address!
    updateAddress(id: ID!, input: AddressInput!): Address!
    deleteAddress(id: ID!): String!
  }

`;
 

  

export default typeDefs;
