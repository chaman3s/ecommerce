import { useQuery } from "@apollo/client/react";
import { SEARCH_PRODUCTS_QUERY } from "../graphql/queries";

export function useSearch(keyword, fields = ["id", "name"]) {
  return useQuery(SEARCH_PRODUCTS_QUERY(fields), {
    variables: { keyword },
    skip: !keyword,
  });
}
