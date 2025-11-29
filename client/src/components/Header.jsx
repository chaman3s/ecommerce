import { ShoppingCart, Search, Menu, Store } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";
import { useCart } from "../lib/cartContext";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export function Header({ onCartOpen, onSearch }) {
  const { itemCount } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const categories = [
    { name: "All Products", path: "/" },
    { name: "Audio", path: "/category/audio" },
    { name: "Accessories", path: "/category/accessories" },
    { name: "Gaming", path: "/category/gaming" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1"
          >
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TechStore</span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2">

            {/* Admin (Desktop) */}
            <Link style={{display:"none"}} to="/admin">
              <Button variant="ghost" className="hidden md:flex">
                Admin
              </Button>
            </Link>

            {/* Cart Button */}
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

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              {/* Mobile Menu Drawer */}
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* Menu Links */}
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

                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        Admin Dashboard
                      </Button>
                    </Link>
                  </nav>

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop Category Navbar */}
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
