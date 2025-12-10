// 📁 src/components/Payment.jsx

import { useMutation, useLazyQuery } from "@apollo/client/react";
import { CREATE_ORDER, VERIFY_PAYMENT } from "../graphql/payment";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment({ amount, userId, onSuccess }) {
  const [createOrder] = useMutation(CREATE_ORDER);
  const [verifyPayment] = useLazyQuery(VERIFY_PAYMENT);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load v3 SDK (works)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => console.log("✔ Cashfree v3 SDK Loaded");
    script.onerror = () => alert("❌ Cashfree SDK failed to load!");
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!window.Cashfree) return alert("SDK loading... wait 1 sec");

    try {
      setLoading(true);

      // 1️⃣ Create order from backend
      const res = await createOrder({
        variables: { amount, customerId: userId }
      });

      const { orderId, orderToken } = res.data.createCashfreeOrder;
      if (!orderToken) return alert("❌ orderToken missing");

      // 2️⃣ Initialize v3 payment
      const cashfree = new window.Cashfree({ mode: "sandbox" }); // test mode

      cashfree.checkout({
        paymentSessionId: orderToken,
        redirectTarget: "_self",    // redirect to payment page
        onSuccess: () => verify(orderId),
        onFailure: (err) => alert("❌ Payment failed: " + err.reason),
      });

    } catch (err) {
      console.log(err);
      alert("❌ Payment creation failed");
    } finally {
      setLoading(false);
    }
  };


  // 3️⃣ Verify payment after completion
  async function verify(orderId) {
    const r = await verifyPayment({ variables:{orderId}, fetchPolicy:"no-cache" });
    const status = r.data.verifyPayment.status;

    if(status === "PAID"){
      alert("🎉 PAYMENT SUCCESS!");

      onSuccess && onSuccess(); // clear cart + place order
      navigate("/orders");
    }
    else alert("⚠ Status: " + status);
  }


  return (
    <div className="mt-4 p-2 border rounded">

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white p-3 rounded">
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>

    </div>
  );
}
