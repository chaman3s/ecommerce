import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_ORDERS } from "../graphql/order";  // <-- API imported

export default function TrackOrders() {
  const [orders, setOrders] = useState([]);

  // ------------------- FETCH ORDERS FROM BACKEND ------------------- //
  const { data, loading } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: "network-only",  // always fresh
  });

  useEffect(() => {
    if (!loading && data?.getMyOrders) {
      setOrders(data.getMyOrders);
    }
  }, [loading, data]);

  // ------------------- BUTTON LOGIC ------------------- //
  const getButtonLabel = (order) => {
    if (!order.deliveryDate) return "Cancel Order"; // not shipped yet

    const today = new Date();
    const delivered = new Date(order.deliveryDate);
    const after7 = new Date(delivered.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (order.deliveryStatus !== "Delivered") return "Cancel Order";
    if (today > after7) return "Buy Again";

    return "Return Order";
  };

  // ------------------- Skeleton UI ------------------- //
  const OrderSkeleton = () => (
    <Card className="w-full mx-[10px] border shadow-sm mb-4">
      <CardContent className="flex gap-4 p-4">
        <Skeleton className="w-24 h-24 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/4 h-4" />
        </div>
        <Skeleton className="w-20 h-8" />
      </CardContent>
    </Card>
  );

  // ------------------- NO ORDERS DISPLAY ------------------- //
  if (!loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076650.png"
          className="w-32 opacity-70 mb-3"
          alt="no orders"
        />
        <h2 className="text-lg font-semibold">No Orders Found</h2>
        <p className="text-gray-500 text-sm w-64 mb-4">
          You haven't placed any orders yet — start shopping!
        </p>

        <Button asChild>
          <Link to="/">Shop Now</Link>
        </Button>
      </div>
    );
  }

  // ------------------- UI WITH ORDERS ------------------- //
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 ml-2">📦 Your Orders</h2>

      {loading && (
        <>
          <OrderSkeleton />
          <OrderSkeleton />
        </>
      )}

      {!loading &&
        orders.map((item) => (
          <Card 
            key={item.id} 
            className="w-full mx-[10px] border shadow-sm hover:shadow-md transition mb-4"
          >
            <CardContent className="flex flex-col md:flex-row gap-4 p-4">

              {/* Image */}
              <div className="w-24 h-24 rounded-md bg-gray-100 mt-[2px]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 justify-center">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="font-bold">₹{item.price}</p>
              </div>

              {/* Delivery & Button */}
              <div className="text-right flex flex-col justify-center">
                <p className="text-sm font-medium text-green-600">
                  Delivery by {new Date(item.deliveryDate).toDateString()}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {item.deliveryStatus}
                </p>

                <Button variant="outline" size="sm" className="ml-auto">
                  {getButtonLabel(item)}
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
    </div>
  );
}
