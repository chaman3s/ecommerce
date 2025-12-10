import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client/react";
import { useCartGraphQL } from "../hooks/useCartGraphQL";
import { GET_ADDRESSES } from "../graphql/address";
import { CHECK_TOKEN } from "../graphql/auth";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { ShoppingBag } from "lucide-react";
import Payment from "../components/Payment";
import { GET_DELIVERY, VALIDATE_COUPON } from "../graphql/price";
import Step from "../components/ui/Step";
import { PLACE_ORDER_AFTER_PAYMENT } from "../graphql/order";
export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartGraphQL();
  const [delivery, setDelivery] = useState(0);
  const [activeStep, setActive] = useState(1);
  const [user, setUser] = useState(null);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [discount, setDiscount] = useState(0);
   const orderItems = items.map(i=>({
    productId:i.productId._id,
    quantity:i.quantity,
    price:i.productId.price
  }));
  //fetch value from backend
  const { data: addressData, loading: addressLoading } = useQuery(
    GET_ADDRESSES,
    {
      skip: !user,
      fetchPolicy: "cache-and-network",
    }
  );
  const addresses = addressData?.getAddresses || [];
  console.log("Addresses:", addresses);
  const [checkToken] = useMutation(CHECK_TOKEN);
  const [fetchDelivery] = useLazyQuery(GET_DELIVERY);
  const [checkCoupon] = useLazyQuery(VALIDATE_COUPON);
  const [placeOrderAfterPayment] = useMutation(PLACE_ORDER_AFTER_PAYMENT);

  //useEffects
  useEffect(() => {
    async function validate() {
      const token = localStorage.getItem("token");
      if (!token) return; // stay step1
      const { data } = await checkToken({ variables: { token } });
      if (!data.checkToken.valid || data.checkToken.expired) {
        localStorage.removeItem("token");
        setActive(1);
        return;
      }
      setUser({
        id: data.checkToken.userId,
        name: data.checkToken.name,
        phone: data.checkToken.number,
      });
      setActive(2);
    }

    validate();
  }, [checkToken]);

  useEffect(() => {
  async function load() {
    if(!selectedAddress) return;
    const city = chosenAddress.city;
    
    const res = await fetchDelivery({ variables:{ city } });
    setDelivery(res.data.getDeliveryCharge); // result from DB
  }
  load();
}, [selectedAddress]);

async function applyCoupon() {
  if(!promo) return;
  const res = await checkCoupon({
    variables:{
      code:promo,
      totalAmount: total + delivery
    }
  });
  const data = res.data.validateCoupon;
  if(!data.valid){
    setPromoError(data.message);
    setDiscount(0);
  } else {
    setPromoError("");
    setAppliedPromo(promo.toUpperCase());
    setDiscount(data.discount);
  }
}
 async function finalizeOrder(orderId){
  let res =await placeOrderAfterPayment({
      variables:{ input:{
        orderId,
        items:orderItems,
        subTotal:total,
        deliveryCharge:delivery,
        discount,
        totalAmount:payable,
        paymentStatus:"Pending",

        customerName:chosenAddress?.name,
        address:chosenAddress?.street,
        city:chosenAddress?.city,
        zipCode:chosenAddress?.zip,
        email:"buyer@mail.com",
        phone:chosenAddress?.phone
      }}
    });
return res;
}
  // Price logic
  const chosenAddress = addresses.find((a) => a.id === selectedAddress);
  const payable = total + delivery - discount;
  // 🟥 No Cart Items
  if (items.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <ShoppingBag className="mx-auto h-14 w-14 text-gray-500" />
          <p className="mt-4 font-semibold text-lg">Your Cart Is Empty</p>
          <Button onClick={() => navigate("/")}>Shop Now</Button>
        </div>
      </div>
    );
  // PAGE UI 

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="container mx-auto p-4">
        <h1 className="font-bold text-2xl mb-4">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ================= LEFT SIDE ================ */}
          <div className="lg:col-span-2 space-y-4">
            {/* STEP 1 LOGIN */}
            <Card>
              <Step
                step={1}
                label="LOGIN"
                active={activeStep === 1}
                done={!!user && activeStep > 1}
                right={user ? user.phone : null}
                onClick={() => setActive(1)}
              />

              {activeStep === 1 && (
                <CardContent className="p-4 bg-white space-y-3">
                  {user ? (
                    <>
                      <p>
                        Logged in as <b>{user.name}</b>
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setActive(2)}>
                          Continue
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("/login")}
                        >
                          Change Account
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        Login to Continue.
                      </p>

                      <div className="flex gap-2">
                        <Button onClick={() => navigate("/login")}>
                          Login
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate("/signup")}
                        >
                          New User? Signup
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              )}
            </Card>

            {/* STEP 2 ADDRESS */}
            <Card>
              <Step
                step={2}
                label="DELIVERY ADDRESS"
                active={activeStep === 2}
                done={activeStep > 2 && selectedAddress}
                right={
                  selectedAddress && activeStep > 2 ? "✓ Selected" : null
                }
                onClick={() => user && setActive(2)}
              />

              {activeStep === 2 && (
                <CardContent className="p-4 bg-white space-y-3">
                  {addressLoading ? (
                    <p>Loading Address...</p>
                  ) : addresses.length === 0 ? (
                    <>
                      <p>No Saved Address.</p>
                      <Button onClick={() => navigate("/addresses")}>
                        + Add Address
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* All Addresses */}
                      <div className="space-y-2">
                        {addresses.map((a) => (
                          <label
                            key={a.id}
                            className={`block p-3 border rounded cursor-pointer
                              ${
                                a.id === selectedAddress
                                  ? "border-blue-600 bg-blue-50"
                                  : "bg-white"
                              }`}
                          >
                            <input
                              type="radio"
                              checked={a.id === selectedAddress}
                              onChange={() => setSelectedAddress(a.id)}
                            />
                            <span className="ml-2 font-semibold">
                              {a.name} ({a.phone})
                            </span>
                            <p className="ml-6 text-xs text-gray-600">
                              {a.street}, {a.city}, {a.state}-{a.zip}
                            </p>
                          </label>
                        ))}
                      </div>

                      <div className="flex justify-between mt-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate("/addresses")}
                        >
                          + Add New Address
                        </Button>

                        <Button
                          disabled={!selectedAddress}
                          onClick={() => setActive(3)}
                        >
                          Deliver Here
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              )}
            </Card>

            {/* STEP 3 ORDER SUMMARY + PAYMENT */}
            <Card>
              <Step
                step={3}
                label="ORDER SUMMARY"
                active={activeStep === 3}
                done={false}
                onClick={() => selectedAddress && setActive(3)}
              />

              {activeStep === 3 && (
                <CardContent className="p-4 bg-white space-y-4">
                  {/* PROMO */}
                  <div>
                    <Label>Apply Promo Code</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                      />
                      <Button onClick={applyCoupon}> Apply</Button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500">{promoError}</p>
                    )}
                    {appliedPromo && (
                      <p className="text-xs text-green-600">
                        Applied: {appliedPromo}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* 🔥 PAYMENT COMPONENT */}
                  <Payment
                    amount={payable.toFixed(2)}
                    userId={user?.id}
                    onClk={finalizeOrder}
                    onSuccess={() => {
                      clearCart();
                    }}
                  />
                </CardContent>
              )}
            </Card>
          </div>

          {/* ================= RIGHT SIDE PRICE BOX ================= */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">
                  PRICE DETAILS
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                {/* Cart Items */}
                {items.map((i) => (
                  <div
                    key={i.productId._id}
                    className="flex justify-between text-xs"
                  >
                    <span>
                      {i.productId.title} × {i.quantity}
                    </span>
                    <span>
                      ₹{(i.productId.price * i.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Price ({items.length} items)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>₹{delivery}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    ₹{discount.toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{payable.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}