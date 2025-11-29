import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Link } from "react-router-dom";

export function ProductCard({ product }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
   
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block"
      style={{ textDecoration: "none" }}
    >
      <Card className="group overflow-hidden transition-all duration-200 h-full flex flex-col">

        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />

          {/* Featured */}
          {product.featured === 1 && (
            <Badge className="absolute top-2 right-2">Featured</Badge>
          )}

          {/* Stock */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Low Stock
            </Badge>
          )}

          {product.stock === 0 && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <p className="text-xs text-muted-foreground uppercase mb-1">
            {product.category}
          </p>

          <h3 className="font-semibold text-base mb-2">{product.name}</h3>

          <p className="text-sm text-muted-foreground mb-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < 4 ? "fill-primary text-primary" : "text-muted"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(128)</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <p className="text-2xl font-bold">
            ${parseFloat(product.price).toFixed(2)}
          </p>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
