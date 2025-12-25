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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess"
// New Pages you want
import TrackOrders from "./pages/TrackOrders";
import AddressBook from "./pages/AddressBook";

function Router() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="w-screen -ml-8 sm:w-auto sm:ml-0 min-h-screen flex flex-col -mt-7 sm:mt-0">
      <Header onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1">
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Pages */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orderConfirmation/:id"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <TrackOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <AddressBook />
              </ProtectedRoute>
            }
          />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

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
