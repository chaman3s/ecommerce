import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Header } from './componets/Header';
function App() {
 const [isCartOpen, setIsCartOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
 const handleSearch = (query) => {
    setSearchQuery(query);
  };
 return(
   <QueryClientProvider client={queryClient}>
     <div className="min-h-screen flex flex-col">
      <Header
            cartItemCount={cartItemCount}
            onCartClick={() => setIsCartOpen(true)}
            onSearch={handleSearch}
          />
     </div>
    <main className="flex-1">
      <Routes>
        
      </Routes>
    </main>
   </QueryClientProvider>
 )
}

export default App
