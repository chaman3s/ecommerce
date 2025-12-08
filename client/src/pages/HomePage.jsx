import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Input } from "../components/ui/Input";
import { ArrowRight, Package, Shield, TruckIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// TEMPORARY JSON PRODUCTS (Later replace with GraphQL)
import products from "../../data.json";

export default function Home() {
  const { category } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const isLoading = false;

  useEffect(() => {
    if (category) setCategoryFilter(category);
    else setCategoryFilter("all");
  }, [category]);

  // SEARCH FILTER
  function matchSearch(p) {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  }

  // CATEGORY FILTER
  function matchCategory(p) {
    if (categoryFilter === "all") return true;
    return p.category.toLowerCase() === categoryFilter;
  }

  // SORTING
  function sortProducts(a, b) {
    if (sortBy === "price-asc") return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === "price-desc") return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return b.featured - a.featured;
  }

  // PROCESSING
  const filteredProducts = products.filter(matchSearch).filter(matchCategory).sort(sortProducts);

  // Unique Categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="min-h-screen bg-white">

      {/* ======================= HERO CAROUSEL ======================= */}
      <section className="relative h-[500px] md:h-[600px] w-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 2500 }}
          loop
          pagination={{ clickable: true }}
          navigation
          className="h-full"
        >
          {[
            "https://images.unsplash.com/photo-1542751110-97427bbecf20",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
          ].map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="h-full w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${img})` }}
              >
                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* HERO TEXT */}
                <div className="absolute inset-0 flex items-center px-8 lg:px-20">
                  <div className="max-w-xl text-white space-y-5">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                      Elevate Your Tech Life 🚀
                    </h1>
                    <p className="text-gray-200 text-lg">
                      Top gadgets at best prices — Fast shipping, Easy returns.
                    </p>
                    <Button size="lg">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ======================= FEATURES STRIP ======================= */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TruckIcon, title: "Free Shipping", desc: "On all orders over ₹999" },
              { icon: Shield, title: "Secure Payment", desc: "100% safe & encrypted" },
              { icon: Package, title: "Easy Returns", desc: "7-day return policy" },
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

      {/* ======================= PRODUCTS SECTION ======================= */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">

          {/* FILTER BAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Shop All Products</h2>
              <p className="text-muted-foreground">Find the best gadgets at best prices</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Input placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[200px]" />

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price ↑</SelectItem>
                  <SelectItem value="price-desc">Price ↓</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PRODUCT LIST */}
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
            <div id="products" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
