import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_MY_Carousel } from "../graphql/carousel";
import { GET_Product } from "../graphql/product";
import { ProductCard } from "../components/ProductCard";
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

import CarouselSkeleton from "../components/ui/CarouselSkeleton";  


export default function Home() {
  const { category } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    category ? setCategoryFilter(category) : setCategoryFilter("all");
  }, [category]);


  //  GET CAROUSEL FROM DB
  const { loading: carouselLoading, error: carouselError, data: carouselData } =
    useQuery(GET_MY_Carousel);

  // GET PRODUCTS FROM DB
  const {
    loading: productLoading,
    error: productError,
    data: productData
  } = useQuery(GET_Product);


  // ================== FILTERING ==================
  function matchSearch(p) {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  function matchCategory(p) {
    if (categoryFilter === "all") return true;
    return p.category.toLowerCase() === categoryFilter;
  }

  function sortProducts(a, b) {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.title.localeCompare(b.title);
    return 0;
  }


  const filteredProducts =
    productData?.getProduct
      ?.filter(matchSearch)
      .filter(matchCategory)
      .sort(sortProducts) || [];


  // get categories from API products instead of JSON
  const categories = [
    ...new Set(productData?.getProduct?.map(p => p.category) || [])
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* 🔥 HERO CAROUSEL */}
      <section className="relative h-[500px] md:h-[600px] w-full">
        {carouselLoading && <CarouselSkeleton />}

        {carouselError && (
          <div className="flex items-center justify-center h-full text-red-600 text-xl">
            Failed to load carousel
          </div>
        )}

        {!carouselLoading && carouselData?.getCarousel?.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 2500 }}
            loop pagination={{ clickable: true }}
            navigation className="h-full"
          >
            {carouselData.getCarousel.map(slide => (
              <SwiperSlide key={slide.id}>
                <div
                  className="h-full w-full bg-cover bg-center relative "
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black/50"></div>
                 
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>


      {/* ================= FEATURES ================= */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              { icon: TruckIcon, title: "Free Shipping", desc: "On all orders over ₹999" },
              { icon: Shield, title: "Secure Payment", desc: "100% safe & encrypted" },
              { icon: Package, title: "Easy Returns", desc: "7-day return policy" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= PRODUCTS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">

          {/* FILTER BAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Shop All Products</h2>
              <p className="text-muted-foreground">Find the best gadgets at best prices</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Input placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-[200px]"
              />

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price ↑</SelectItem>
                  <SelectItem value="price-desc">Price ↓</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* PRODUCT LIST */}
          {productLoading ? (
            <SkeletonGrid />
          ) : productError ? (
            <p className="text-center text-red-600">Failed to load products</p>
          ) : filteredProducts.length === 0 ? (
            <EmptyProduct />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}


// 📌 Skeleton Loader UI
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}


// 📌 Empty UI
function EmptyProduct() {
  return (
    <div className="text-center py-20">
      <Package className="mx-auto h-16 w-16 opacity-50" />
      <h3 className="text-xl font-semibold mt-3">No Products Found</h3>
      <p className="text-gray-500">Try adjusting filters or search.</p>
    </div>
  );
}
