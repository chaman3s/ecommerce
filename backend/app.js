import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connectDB from "./utils/db.js";
import typeDefs from "./schema/typeDefs.js";
import resolvers from "./resolvers/index.js";


// Connect to MongoDB
await connectDB();


const server = new ApolloServer({
typeDefs,
resolvers,
});


const { url } = await startStandaloneServer(server, {
listen: { port: process.env.PORT || 4000 },
context: async ({ req }) => {
// Extract token (if present) and pass it to resolvers via context
const auth = req.headers.authorization || "";
const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
return { token };
}
});


console.log(`🚀 GraphQL server ready at ${url}`);