// 📌 src/components/Payment.jsx

import { useMutation, useLazyQuery } from "@apollo/client/react";
import { CREATE_ORDER, VERIFY_PAYMENT } from "../graphql/payment";
import { useState } from "react";
import { loadDropin } from "cashfree-dropjs";
import { useNavigate } from "react-router-dom";

export default function Payment({ amount, userId, onSuccess }) {
  const [createOrder] = useMutation(CREATE_ORDER);
  const [verifyPayment] = useLazyQuery(VERIFY_PAYMENT);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Order from GraphQL
      const order = await createOrder({
        variables: { amount, customerId: userId || null }
      });

      const { orderId, orderToken } = order.data.createCashfreeOrder;

      // 2️⃣ Open Cashfree Payment Popup
      await loadDropin(
        {
          orderToken,
          onSuccess: async () => {
            await checkStatus(orderId);
          },
          onFailure: () => {
            alert("❌ Payment Failed");
          },
        },
        "#payment-box"
      );
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong in payment.");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ After payment → Verify status using GraphQL
  async function checkStatus(orderId) {
    const res = await verifyPayment({
      variables: { orderId },
      fetchPolicy: "network-only"
    });

    const status = res.data.verifyPayment.status;

    if (status === "PAID") {
      alert("🎉 Payment Success");

      if (onSuccess) onSuccess(); // tell parent (Checkout) to clear cart etc.

      navigate("/orders");
    } else {
      alert("❌ Payment Failed or Pending");
    }
  }

  return (
    <div>
      {/* Cashfree mounts its UI here */}
      <div id="payment-box"></div>

      <button
        className="bg-green-600 text-white p-3 rounded mt-2 w-full"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </div>
  );
}
