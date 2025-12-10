// 📁 src/pages/PaymentSuccess.jsx

import { useSearchParams, useNavigate } from "react-router-dom";
import { VERIFY_PAYMENT } from "../graphql/payment";
import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { CLEAR_CART } from "../graphql/cart";
import { useCartGraphQL } from "../hooks/useCartGraphQL";


export default function PaymentSuccess() {
  const { clearCart } = useCartGraphQL();
  const [verifyPayment] = useLazyQuery(VERIFY_PAYMENT);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("orderId");

  useEffect(() => {
    async function check(){
      console.log("orderId:", orderId);
      const res = await verifyPayment({ variables:{ orderId }});
      const status = res.data.verifyPayment.status;
      if(status === "PAID"){

        localStorage.removeItem("cart");
        clearCart();
        navigate(`/orderConfirmation/${orderId}`);
      } else {
        alert("⚠ Payment Status : " + status);
      }
    }
    check();
  }, []);

  return <h2>⏳ Verifying payment...</h2>;
}
