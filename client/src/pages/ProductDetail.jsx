import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { Separator } from "../components/ui/separator";

import {
  ShoppingCart,
  Star,
  ChevronLeft,
  Minus,
  Plus,
  Package,
  Shield,
  TruckIcon,
} from "lucide-react";

import productsData from "../../data.json";
import { useCart } from "../lib/cartContext";
import { useToast } from "../hooks/useToast";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Load product from local JSON
  useEffect(() => {
    const productId = Number(id); // FIX: convert string → number
    const found = productsData.find((p) => p.id === productId);
    setProduct(found);
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to cart.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="aspect-square w-full mb-6" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* IMAGE */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.featured === 1 && (
                <Badge className="absolute top-4 right-4">Featured</Badge>
              )}

              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  Only {product.stock} left!
                </Badge>
              )}

              {product.stock === 0 && (
                <Badge variant="secondary" className="absolute top-4 left-4">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase mb-2">
                {product.category}
              </p>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              {/* Static rating */}
              <div className="ml-[33%] flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="text-sm text-muted-foreground">
                  (128 reviews)
                </span>
              </div>

              <p className="text-3xl font-bold mb-4">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Separator />

            {/* QUANTITY */}
            <div className="ml-[22%] flex items-center gap-4">
              <span className="font-semibold">Quantity:</span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="w-10 text-center">{quantity}</span>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={product.stock === 0}
              >
                <Plus className="h-4 w-4" />
              </Button>

              <span className="text-sm text-muted-foreground">
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            <Separator />

            {/* EXTRA INFO */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-primary" />
                Free shipping on orders over $50
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                2-year warranty included
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Easy 30-day returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
