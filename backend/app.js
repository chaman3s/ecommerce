import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connectDB from "./utils/db.js";
import typeDefs from "./schema/typeDefs.js";
import resolvers from "./resolvers/index.js";
import jwt from "jsonwebtoken";    // <-- REQUIRED

// Connect DB
await connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },

  context: async ({ req }) => {
    const auth = req.headers.authorization || "";
    let user = null;

    if (auth.startsWith("Bearer ")) {
      const token = auth.replace("Bearer ", "");

      try {
        user = jwt.verify(token, process.env.JWT_SECRET_USER || "usersecret");
      } catch (err) {
        console.log("Invalid Token");
      }
    }

    return { user };  // <- now resolvers get {user}
  }
});

console.log(`🚀 Server running at ${url}`);
