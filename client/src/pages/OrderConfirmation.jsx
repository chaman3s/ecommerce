import { useQuery } from "@apollo/client/react";
import { useParams, Link } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Separator } from "../components/ui/separator";
import { CheckCircle2, Package } from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";

import { GET_ORDER_BY_ID } from "../graphql/order"; // <-- NEW IMPORT

export default function OrderConfirmation() {
  const { id } = useParams();

  // Fetch order using GraphQL
  const { data, loading } = useQuery(GET_ORDER_BY_ID, {
    variables: { id }
  });

  const order = data?.getOrderById;

  if (loading) {
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
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          
          {/* SUCCESS ICON */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for shopping with us 🎉
            </p>
          </div>

          {/* ORDER DETAILS CARD */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Order Number</p>
                  <p className="font-medium">{order._id}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Date</p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p className="capitalize font-medium text-green-600">{order.deliveryStatus}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-bold text-lg">₹{order.totalAmount}</p>
                </div>
              </div>

              <Separator />

              {/* ADDRESS */}
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm text-muted-foreground">
                {order.address?.name}<br/>
                {order.address?.street}<br/>
                {order.address?.city}, {order.address?.state} - {order.address?.zip}<br/>
                📞 {order.address?.phone}
              </p>

              <Separator />

              {/* ITEMS */}
              <h3 className="font-semibold mb-2">Order Items</h3>
              {order.items.map((item)=>(
                <div key={item.productId._id} className="flex justify-between text-sm py-1">
                  <span>{item.productId.title} × {item.quantity}</span>
                  <span className="font-medium">₹{item.productId.price * item.quantity}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total Payed</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* FOOTER */}
          <div className="flex justify-between items-center mb-4 p-4 bg-muted/40 rounded-lg">
            <Package className="text-primary" />
            <p className="text-sm text-muted-foreground">
              Your items will be shipped soon 📦
            </p>
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
