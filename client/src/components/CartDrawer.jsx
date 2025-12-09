import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "./ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useCartGraphQL } from "../hooks/useCartGraphQL";
import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";

export function CartDrawer({ open, onOpenChange }) {

  const { items, removeFromCart, updateQuantity, total, itemCount } = useCartGraphQL();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">

              {items.map(item => (
                <div key={item.productId._id} className="flex gap-4 p-4 border rounded-lg">
                  
                  <img src={item.productId.thumbnail} className="w-20 h-20 rounded-lg object-cover" />

                  <div className="flex-1">
                    <h4 className="font-semibold">{item.productId.title}</h4>
                    <p>₹{item.productId.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button size="icon" onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>
                        <Minus />
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <Button size="icon" onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>
                        <Plus />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.productId._id)}>
                      <X />
                    </Button>
                    <p className="font-bold">₹{(item.quantity * item.productId.price).toFixed(2)}</p>
                  </div>

                </div>
              ))}

            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button className="w-full mt-3" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
