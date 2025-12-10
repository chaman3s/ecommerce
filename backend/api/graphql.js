import { ApolloServer } from "apollo-server-micro";
import connectDB from "../utils/db.js";
import typeDefs from "../schema/typeDefs.js";
import resolvers from "../resolvers/index.js";

let server = null;
let dbConnected = false;

async function startApolloServer() {
  if (!server) {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
      console.log("MongoDB Connected 🌍 (Vercel)");
    }

    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();

    server = apolloServer.createHandler({ path: "/api/graphql" });
  }
  return server;
}

/* 🔥 CORS FIX FOR REACT + VERCEL */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  // ⚠ recommended after testing:
  // res.setHeader("Access-Control-Allow-Origin", "https://your-frontend-domain.com");

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight response
  }

  const graphqlHandler = await startApolloServer();
  return graphqlHandler(req, res);
}

export const config = {
  api: { bodyParser: false },
};
