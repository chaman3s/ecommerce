
import axios from "axios";

export default {
  Mutation: {
    createCashfreeOrder: async (_, { amount, customerId }) => {
      const CLIENT_ID = process.env.TEST_CLIENT_ID;
      const CLIENT_SECRET = process.env.TEST_CLIENT_SECRET;

      const orderId = "order_" + Date.now();

      const res = await axios.post(
        "https://sandbox.cashfree.com/pg/orders",
        {
          order_id: orderId,
          order_amount: 200,
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

      return {
        orderId,
        status: res.data.order_status,
        amount: res.data.order_amount,
        referenceId: res.data.cf_order_id,
      };
    }
  }
};
