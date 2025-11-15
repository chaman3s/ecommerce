import { Card, CardContent } from "./ui/Card";
import  {Button} from "./ui/Button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
export function ProductCard({ product, onAddToCart }) {
    return (
    <Card className="group overflow-hidden transition-all">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-muted cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="cursor-pointer">
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {product.description}
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            ₹{Number(product.price).toFixed(2)}
          </span>

          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
