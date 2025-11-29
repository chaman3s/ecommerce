import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Separator } from "../components/ui/separator";
import { CheckCircle2, Package } from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";

// Fetch order from local data.json
async function fetchOrder(id) {
  const response = await fetch("../../orderData.json");
  const json = await response.json();
  return json.orders.find((order) => order.id === id);
}

export default function OrderConfirmation() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const items = JSON.parse(order.items);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Order Number</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p className="font-medium capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total</p>
                  <p className="font-medium">
                    ${parseFloat(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">{order.customerName}</p>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.zipCode}</p>
                  <p>{order.email}</p>
                  <p>{order.phone}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Items Ordered</h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">What's next?</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email to {order.email}. Your order will be processed
                  in 1–2 business days.
                </p>
              </div>
            </div>
          </div>

          <Link to="/" className="flex">
            <Button variant="outline" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
