import { ApolloServer } from "apollo-server-micro";
import jwt from "jsonwebtoken";
import connectDB from "../utils/db.js";
import typeDefs from "../typeDefs/index.js";
import resolvers from "../resolvers/index.js";

let server;
let dbConnected = false;

async function startApolloServer() {
  if (!server) {
    // Connect MongoDB only once
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
      console.log("MongoDB Connected 🌍 (Vercel)");
    }

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,

      // 🔐 AUTH CONTEXT (IMPORTANT)
      context: ({ req }) => {
        const auth = req.headers.authorization || "";
        let user = null;

        if (auth.startsWith("Bearer ")) {
          const token = auth.replace("Bearer ", "");
          try {
            user = jwt.verify(
              token,
              process.env.JWT_SECRET_USER || "usersecret"
            );
          } catch (err) {
            console.log("Invalid Token");
          }
        }

        return { user };
      },
    });

    await apolloServer.start();
    server = apolloServer.createHandler({ path: "/api/graphql" });
  }

  return server;
}

/* 🔥 CORS FOR REACT + VERCEL */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const graphqlHandler = await startApolloServer();
  return graphqlHandler(req, res);
}

export const config = {
  api: { bodyParser: false },
};
