import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CART, ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_ITEM, CLEAR_CART } from "../graphql/cart";

export function useCartGraphQL() {
  const { data, loading } = useQuery(GET_CART, { fetchPolicy: "cache-and-network" });

  const [addMutation] = useMutation(ADD_TO_CART, { refetchQueries: [GET_CART] });
  const [updateMutation] = useMutation(UPDATE_CART_ITEM, { refetchQueries: [GET_CART] });
  const [removeMutation] = useMutation(REMOVE_ITEM, { refetchQueries: [GET_CART] });
  const [clearMutation] = useMutation(CLEAR_CART, { refetchQueries: [GET_CART] });

  const addToCart = async (productId, quantity = 1) =>
    addMutation({ variables: { productId, quantity } }); // ⬅ FIXED FORMAT

  const updateQuantity = async (productId, quantity) =>
    updateMutation({ variables: { productId, quantity } });

  const removeFromCart = async (productId) =>
    removeMutation({ variables: { productId } });

  const clearCart = async () => clearMutation();

  return {
    items: data?.cart?.items || [],
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: data?.cart?.items?.reduce((x,y)=>x+y.quantity,0) || 0,
    total: data?.cart?.items?.reduce((x,y)=>x+y.quantity*y.productId.price,0) || 0
  };
}
