import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Input } from "../components/ui/Input";
import { ArrowRight, Package, TruckIcon, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// Load products from JSON
import products from "../../data.json";

export default function Home() {
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Since using JSON, no loading state needed
  const isLoading = false;

  // ---------------------------
  // Filter: Search
  // ---------------------------
  function matchSearch(p) {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // ---------------------------
  // Filter: Category
  // ---------------------------
  function matchCategory(p) {
    if (categoryFilter === "all") return true;
    return p.category.toLowerCase() === categoryFilter;
  }

  // ---------------------------
  // Sort logic
  // ---------------------------
  function sortProducts(a, b) {
    if (sortBy === "price-asc")
      return parseFloat(a.price) - parseFloat(b.price);

    if (sortBy === "price-desc")
      return parseFloat(b.price) - parseFloat(a.price);

    if (sortBy === "name") return a.name.localeCompare(b.name);

    return b.featured - a.featured; // default Featured
  }

  // Apply filters + sorting
  const filteredProducts = products
    .filter(matchSearch)
    .filter(matchCategory)
    .sort(sortProducts);

  // Unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-white">

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-primary/20 to-background">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Premium Tech
              <br />
              <span className="text-primary">For Everyone</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground">
              Discover the latest gadgets and accessories at unbeatable prices.
              Free shipping on all orders.
            </p>

            <Button size="lg" className="text-base">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- BENEFITS ---------------- */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TruckIcon, title: "Free Shipping", desc: "On all orders over $50" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
              { icon: Package, title: "Easy Returns", desc: "30-day return policy" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRODUCTS SECTION ---------------- */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Header + Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Shop All Products</h2>
              <p className="text-muted-foreground">Browse our premium tech products</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

              {/* Search Bar */}
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[200px]"
              />

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
