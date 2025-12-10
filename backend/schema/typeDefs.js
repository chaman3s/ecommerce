

const typeDefs = `#graphql
type User {
  id: ID!
  name: String!
  number: String!
  token: String
}
type PaymentOrderResponse {
  orderId: String!
  orderToken: String!
}
type PaymentStatus {
    orderId: String!
    status: String!
    amount: Float
    referenceId: String   # <-- ADD THIS
  }

  type CreateOrderResponse {
    orderId: String!
    orderToken: String!
  }
 

type TokenStatus {
  valid: Boolean!
  expired: Boolean!
  userId: ID
  name: String
  number: String
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
  scalar ObjectID
  type Product {
   _id: ObjectID! 
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
  total: Float
  updatedAt: String
}

  

 type CartItem {
  productId: Product!
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
type OrderItem {
    productId: Product!
    quantity: Int!
    price: Float!
  }
type Order {
    id: ID!
    orderId: String!
    userId: ID!
    items: [OrderItem!]!

    subTotal: Float!
    deliveryCharge: Float
    discount: Float
    totalAmount: Float!

    paymentStatus: String!
    deliveryStatus: String!
    estimatedDelivery: String

    customerName: String
    address: String
    city: String
    zipCode: String
    email: String
    phone: String

    createdAt: String
    updatedAt: String
  }
  
  input OrderItemInput {
    productId: ObjectID!
    quantity: Int!
    price: Float!
  }
  input PlaceOrderInput {
    orderId: String!          # Cashfree orderId
    items: [OrderItemInput!]!
    subTotal: Float!
    deliveryCharge: Float!
    discount: Float
    totalAmount: Float!
    paymentStatus: String!    # should be "PAID"
    customerName: String
    address: String
    city: String
    zipCode: String
    email: String
    phone: String
  }


  type Query {
    users: [User]
     products: [Product!]!
    getProduct: [Product!]!
    getProductItem(id:ObjectID!):Product
    getProductsByCategory(category: String!): [Product!]!
    categories: [String!]!  
    searchProducts(keyword: String!): [Product]     # FIXED: return ONE cart, not array
    getCarousel: [CarouselItem!]!
    getCarouselItem(id: ID!): CarouselItem
    cart: Cart  
    getAddresses: [Address!]
    verifyPayment(orderId: String!): PaymentStatus
    getMyOrders: [Order!]!
    getOrder(orderId: String!): Order

  }

type Mutation {
  signup(name: String!, number: String!, password: String!): User
  login(number: String!, password: String!): User
  placeOrder(productId: ID!, quantity: Int!): Order
  addCarouselItem(input: CarouselInput): CarouselItem
  addAddress(input: AddressInput!): Address!
  updateAddress(id: ID!, input: AddressInput!): Address!
  deleteAddress(id: ID!): String!
  getAddresses: [Address!]
  getMyOrders: [Order]
  addToCart(productId: ObjectID!, quantity: Int!): Cart
  updateCartItem(productId: ObjectID!, quantity: Int!): Cart
  removeCartItem(productId: ObjectID!): Cart
  clearCart: Boolean
  checkToken(token: String!): TokenStatus!
  placeOrderAfterPayment(input: PlaceOrderInput!): Order!
}
type PaymentOrderResponse {
  orderId: String!
  orderToken: String!
}

 type Mutation {
    createCashfreeOrder(amount: Float!, customerId: ID): CreateOrderResponse!
  }






`;
 

  

export default typeDefs;
