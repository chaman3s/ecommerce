import Product from "../models/Product.js";
export default {
  Query: {
    getProduct: async () => await Product.find().lean(),
    getProductItem: async (_, { id }) => await Product.findById(id).lean(),
    searchProducts: async (_, { keyword }) => {
          return Product.find({
            $or: [
              { title: { $regex: keyword, $options: "i" } },
              { description: { $regex: keyword, $options: "i" } },
              { category: { $regex: keyword, $options: "i" } },
            ]
          });
        },

    categories: async () => {
        const products = await Product.find({}, "category");
        return [...new Set(products.map(p => p.category))];
      },
    getProductsByCategory: async (_, { category }) =>await Product.find({ category: { $regex: category } })
      
  },
 
}