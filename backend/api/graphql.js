import { ApolloServer } from "apollo-server-micro";
import connectDB from "../utils/db.js";
import typeDefs from "../schema/typeDefs.js";
import resolvers from "../resolvers/index.js";

let dbConnected = false;

async function startServer() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
    console.log("MongoDB Connected 🌍 (Vercel)");
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  return server.createHandler({
    path: "/api/graphql",
  });
}

export default async function handler(req, res) {
  const graphqlHandler = await startServer();
  return graphqlHandler(req, res);
}

export const config = {
  api: { bodyParser: false },
};
