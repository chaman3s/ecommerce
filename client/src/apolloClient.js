// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/react";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  headers: {
    Authorization: localStorage.getItem("token")
      ? "Bearer " + localStorage.getItem("token")
      : ""
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
