import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CART, ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_ITEM, CLEAR_CART } from "../graphql/cart";

export function useCartGraphQL() {

  const { data, loading, refetch } = useQuery(GET_CART);

  const [addMutation] = useMutation(ADD_TO_CART);
  const [updateMutation] = useMutation(UPDATE_CART_ITEM);
  const [removeMutation] = useMutation(REMOVE_ITEM);
  const [clearMutation] = useMutation(CLEAR_CART);

  const items = data?.cart?.items || [];

  const addToCart = async (productId, quantity = 1) => {
    await addMutation({ variables: { productId, quantity } });
    refetch();
  };

  const updateQuantity = async (productId, quantity) => {
    await updateMutation({ variables: { productId, quantity } });
    refetch();
  };

  const removeFromCart = async (productId) => {
    await removeMutation({ variables: { productId } });
    refetch();
  };

  const clearCart = async () => {
    await clearMutation();
    refetch();
  };

  const total = items.reduce((sum, i) => sum + (i.quantity * i.productId.price), 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, loading, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount };
}
