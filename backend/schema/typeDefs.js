const typeDefs = `#graphql

  type User {
    id: ID!
    name: String!
    email: String!
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
    cart: Cart        # FIXED: return ONE cart, not array
  }

  # ------------------- INPUTS -------------------
  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  # ------------------- MUTATIONS -------------------
  type Mutation {
    register(input: RegisterInput!): User
  }

`;

export default typeDefs;
