import { ShoppingCart, Search, Menu, Store, User } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

// Apollo
import { useQuery } from "@apollo/client/react";
import { GET_CART } from "../graphql/cart";
import { GET_CATEGORIES } from "../graphql/queries";
import { useSearch } from "../hooks/useSearch";

export function Header({ onCartOpen }) {
  const navigate = useNavigate();

  // ---------------- CART ----------------
  const { data: cartData } = useQuery(GET_CART);
  const itemCount =
    cartData?.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // ---------------- STATE ----------------
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---------------- AUTH ----------------
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "";
  const isLoggedIn = !!token;
  const userInitial = userName ? userName[0].toUpperCase() : "";

  // ---------------- CATEGORIES ----------------
  const { data: categoryData } = useQuery(GET_CATEGORIES);
  const categories =
    categoryData?.categories?.map((cat) => ({
      name: cat,
      path: `/category/${cat.toLowerCase()}`,
    })) || [];

  categories.unshift({ name: "All Products", path: "/" });

  // ---------------- SEARCH ----------------
  const { data: searchResults } = useSearch(searchQuery, ["id", "name"]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">

          {/* ================= MOBILE MENU (BEFORE LOGO) ================= */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-4 mt-6">

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit}>
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                {/* Mobile Auth */}
                {!isLoggedIn ? (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Sign up</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        🧾 My Orders
                      </Button>
                    </Link>
                    <Link to="/addresses" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        📍 Address Book
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                )}

                {/* Mobile Categories */}
                <nav className="flex flex-col gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.path}
                      to={c.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        {c.name}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* ================= LOGO ================= */}
          <Link to="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MyStore</span>
          </Link>

          {/* ================= DESKTOP SEARCH ================= */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex flex-1 max-w-md mx-4"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />

            {searchQuery && searchResults?.searchProducts?.length > 0 && (
              <Card className="absolute top-12 w-full bg-white border shadow-lg p-2 z-50">
                {searchResults.searchProducts.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={() => setSearchQuery("")}
                  >
                    <div className="p-2 hover:bg-gray-100 cursor-pointer">
                      {item.name}
                    </div>
                  </Link>
                ))}
              </Card>
            )}
          </form>

          {/* ================= CART + DESKTOP PROFILE ================= */}
          <div className="flex items-center gap-3">

            {/* Cart */}
            <Button variant="ghost" size="icon" onClick={onCartOpen}>
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge className="absolute top-4 right-2.5  sm:right-[82px] sm:text-[6px] text-[5px] pr-1 pl-1">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* DESKTOP PROFILE */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {userInitial || <User className="h-4 w-4" />}
                  </button>

                  <Card className="hidden group-hover:flex flex-col absolute right-0 mt-2 w-48 bg-white border shadow-lg z-50">
                    <Link to="/orders" className="px-3 py-2 hover:bg-gray-100">
                      🧾 My Orders
                    </Link>
                    <Link to="/addresses" className="px-3 py-2 hover:bg-gray-100">
                      📍 Address Book
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-red-600 hover:bg-red-100 text-left"
                    >
                      Logout
                    </button>
                  </Card>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP CATEGORY BAR ================= */}
      <div className="hidden md:block border-t">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex gap-1 py-2 overflow-x-auto">
            {categories.map((c) => (
              <Link key={c.path} to={c.path}>
                <Button variant="ghost" size="sm">
                  {c.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
