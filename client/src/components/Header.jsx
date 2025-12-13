import { ShoppingCart, Search, Menu, Store, User } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { GET_CART } from "../graphql/cart";


// Apollo Client
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../graphql/queries";
import { useSearch } from "../hooks/useSearch";

export function Header({ onCartOpen }) {
  const navigate = useNavigate();
  const { data: cartData } = useQuery(GET_CART);
  console.log("cart",cartData)
  const itemCount  = cartData?.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  console.log(itemCount,":item Count")
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---------- Simple auth state (from localStorage) ----------
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "";
  const isLoggedIn = !!token;

  const userInitial =
    userName.trim().length > 0
      ? userName.trim().charAt(0).toUpperCase()
      : "";

  // --------------- Fetch Categories ---------------
  const { data: categoryData } = useQuery(GET_CATEGORIES);

  const categories =
    categoryData?.categories?.map((cat) => ({
      name: cat,
      path: `/category/${cat.toLowerCase()}`,
    })) || [];

  categories.unshift({ name: "All Products", path: "/" });

  // --------------- LIVE SEARCH RESULTS ---------------
  const { data: searchResults } = useSearch(searchQuery, ["id", "name"]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TechStore</span>
          </Link>

          {/* ======================== SEARCH BAR ======================== */}
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
              className="pl-10 w-full"
            />

            {/* SEARCH DROPDOWN */}
            {searchQuery && searchResults?.searchProducts?.length > 0 && (
              <Card className="absolute top-12 w-full bg-white border shadow-lg p-2 z-50">
                {searchResults.searchProducts.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={() => setSearchQuery("")}
                  >
                    <div className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between">
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}

                {searchResults.searchProducts.length > 5 && (
                  <Link
                    to={`/search?q=${searchQuery}`}
                    className="block p-2 text-blue-600 text-sm hover:bg-gray-100"
                    onClick={() => setSearchQuery("")}
                  >
                    View all {searchResults.searchProducts.length} results →
                  </Link>
                )}
              </Card>
            )}
          </form>

          {/* ==================== CART + PROFILE + MOBILE MENU ==================== */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartOpen}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 text-xs px-1 rounded-full">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* PROFILE / LOGIN AREA */}
            {isLoggedIn ? (
              // ---------- Logged In: show avatar + Card menu ----------
              <div className="relative group">
                <button className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {userInitial || <User className="h-4 w-4" />}
                </button>

                <Card className="hidden group-hover:flex flex-col absolute right-[-161%] mt-[2%] w-52 bg-white border shadow-lg rounded-md overflow-hidden z-50">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b">
                    Signed in as
                    <div className="font-medium text-gray-800 truncate">
                      {userName || "User"}
                    </div>
                  </div>

                  <Link
                    to="/orders"
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    🧾 Track / My Orders
                  </Link>

                  <Link
                    to="/addresses"
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    📍 Address Book
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-100 text-left"
                  >
                    🚪 Logout
                  </button>
                </Card>
              </div>
            ) : (
              // ---------- Not Logged in: show Login / Signup ----------
              <div className="flex items-center gap-2">
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

            {/* MOBILE MENU */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* Mobile Categories */}
                  <nav className="flex flex-col gap-2">
                    {categories.map((c) => (
                      <Link
                        key={c.path}
                        to={c.path}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          {c.name}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ======================== CATEGORY BAR ======================== */}
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
