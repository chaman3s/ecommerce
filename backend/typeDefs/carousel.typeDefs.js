import { gql } from "apollo-server-micro";

export const carouselTypeDefs = gql`
  type CarouselItem {
    id:ID!
    title:String!
    description:String!
    image:String!
  }

  input CarouselInput { title:String! description:String! image:String! }

  extend type Query {
    getCarousel:[CarouselItem!]!
    getCarouselItem(id:ID!):CarouselItem
  }

  extend type Mutation { addCarouselItem(input:CarouselInput):CarouselItem }
`;
