import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { ADD_TO_CART, GET_CART } from "../graphql/cart";

export function ProductCard({ product }) {

  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    refetchQueries: [GET_CART],
  });

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart({
        variables: {
          productId: product._id,   // 🔥 FIXED — must be ObjectId
          quantity: 1
        }
      });

      console.log("Added to cart:", product.title);
    } catch (err) {
      console.error("Cart Error:", err.message);
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <Card className="group overflow-hidden h-full flex flex-col">

        <div className="relative aspect-square bg-muted">
          <img src={product.thumbnail} alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"/>
        </div>

        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-base mb-2">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {product.description?.slice(0, 60)}...
          </p>

          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-primary"/>
            ))}
            <span className="text-xs text-muted-foreground ml-1">(128)</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex flex-col gap-1 sm:flex-row justify-between items-center ">
          <p className="text-2xl font-bold">₹{product.price}</p>

          <Button disabled={loading || product.stock === 0} className={"text-[8px] sm:text-[10px]"} onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
