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

  # ------------------- QUERIES -------------------
  type Query {
    users: [User]
    products: [Product]
    cart: Cart  
    categories: [String!]!  
     searchProducts(keyword: String!): [Product]     # FIXED: return ONE cart, not array
  }

  # ------------------- INPUTS -------------------


  # ------------------- MUTATIONS -------------------
type Mutation {
  signup(name: String!, number: String!, password: String!): User
  login(number: String!, password: String!): User
}

`;

export default typeDefs;
