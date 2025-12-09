import Carousel from "../models/Carousel.js";
export default {
    Query: {
    getCarousel: async () => await Carousel.find(),
    getCarouselItem: async (_, { id }) => await Carousel.findById(id),
  },
  Mutation: {
    addCarouselItem: async (_, { input }) => {
      const newItem = new Carousel(input);
      return await newItem.save();
    }
}
};