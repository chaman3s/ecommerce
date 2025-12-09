import { gql } from "@apollo/client";
export const GET_MY_Carousel = gql`
query {
    getCarousel{
        title,
        image,
        description,
    }
}`;