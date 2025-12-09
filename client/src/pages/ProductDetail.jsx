import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_ProductById } from "../graphql/product";
import { ADD_TO_CART } from "../graphql/cart";
import { Button } from "../components/ui/Button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useCartGraphQL } from "../hooks/useCartGraphQL";
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_ProductById, {
    variables: { id }
  });

  const {addToCart} = useCartGraphQL();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );

  if (error || !data?.getProductItem)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Product Not Found</h2>
          <p className="text-muted-foreground">Try searching other items.</p>
        </div>
      </div>
    );

  const product = data.getProductItem;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, 1); ;
    } catch (err) {
      console.error(err);
    }
    setAdding(false);
  };

  const handleBuyNow = async () => {
    setBuying(true);
    try {
      await addToCart(product._id, 1); 
      navigate("/checkout"); // AUTO REDIRECT
    } catch (err) {
      console.error(err);
    }
    setBuying(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      
      {/* PRODUCT IMAGE */}
      <div className="flex justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="rounded-xl shadow-md w-80 object-cover"
        />
      </div>

      {/* PRODUCT DETAILS */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        <p className="text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>

        {/* ADD TO CART BUTTON */}
        <Button className="w-full" onClick={handleAdd} disabled={adding}>
          {adding ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
          {adding ? "Adding..." : "Add to Cart"}
        </Button>

        {/* BUY NOW BUTTON */}
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleBuyNow}
          disabled={buying}
        >
          {buying ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
          {buying ? "Processing..." : "Buy Now"}
        </Button>
      </div>
    </div>
  );
}
