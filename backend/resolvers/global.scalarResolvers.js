import { GraphQLScalarType, Kind } from "graphql";
import mongoose from "mongoose";

export const objectIdScalar = {
  ObjectID: new GraphQLScalarType({
    name: "ObjectID",
    description: "MongoDB ObjectID custom scalar",

    serialize(value) {
      return value.toString();          // output to client
    },

    parseValue(value) {
      return new mongoose.Types.ObjectId(value); // input from variable
    },

    parseLiteral(ast) {
      return ast.kind === Kind.STRING
        ? new mongoose.Types.ObjectId(ast.value)
        : null;
    }
  })
};
