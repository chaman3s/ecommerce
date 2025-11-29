import { useState } from "react";
import Checkout from "./pages/CheckoutPages";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import ProductDetail from "./pages/ProductDetail";
import { Header } from "./components/Header";
import HomePage from "./pages/HomePage";
import { CartProvider } from "./lib/cartContext";
import { CartDrawer } from "./components/CartDrawer";
import OrderConfirmation from "./pages/OrderConfirmation";
function Router() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/orderConfirmation/:id" element={<OrderConfirmation/>} />
        </Routes>
      </main>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router />
      </CartProvider>
    </QueryClientProvider>
  );
}
