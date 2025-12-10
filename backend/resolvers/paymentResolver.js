
import axios from "axios";
import Order from "../models/Order.js";

export default {
  Mutation: {
    createCashfreeOrder: async (_, { amount, customerId ,orderId}) => {
      const CLIENT_ID = process.env.TEST_CLIENT_ID;
      const CLIENT_SECRET = process.env.TEST_CLIENT_SECRET;
      const res = await axios.post(
        "https://sandbox.cashfree.com/pg/orders",
        {
          order_id: orderId,
          order_amount: amount,
          order_currency: "INR",
          customer_details: {
            customer_id: customerId || "guest",
            customer_phone: "9999999999",
          },
          order_meta: {
            return_url: `http://localhost:5173/payment-success?orderId=${orderId}`
          }
        },
        {
          headers: {
            "x-api-version": "2022-09-01",
            "x-client-id": CLIENT_ID,
            "x-client-secret": CLIENT_SECRET,
            "Content-Type": "application/json"
          }
        }
      );

      return {
        orderId,
        orderToken: res.data.payment_session_id
      };
    }
  },

  Query: {
    verifyPayment: async (_, { orderId }) => {
      const CLIENT_ID = process.env.TEST_CLIENT_ID;
      const CLIENT_SECRET = process.env.TEST_CLIENT_SECRET;

      const res = await axios.get(
        `https://sandbox.cashfree.com/pg/orders/${orderId}`,
        {
          headers: {
            "x-api-version": "2022-09-01",
            "x-client-id": CLIENT_ID,
            "x-client-secret": CLIENT_SECRET
          }
        }
      );
       const status = res.data.order_status;  // PAID | ACTIVE | FAILED

        // 🔥 Update Order Status In DB Automatically
        if (status === "PAID") {
          await Order.findOneAndUpdate(
            { orderId },
            { paymentStatus: "Paid" }
          );
        } else if (status === "FAILED") {
          await Order.findOneAndUpdate(
            { orderId },
            { paymentStatus: "Failed" }
          );
        } else {
          await Order.findOneAndUpdate(
            { orderId },
            { paymentStatus: "Not Found" }
          );
        }
      return {
        orderId,
        status: res.data.order_status,
        amount: res.data.order_amount,
        referenceId: res.data.cf_order_id,
      };
    }
  }
};
