import axios from "axios";

export default {
  Mutation: {
    createCashfreeOrder: async (_, { amount, customerId }) => {
      try {
        const APP_ID     = process.env.TEST_CLIENT_ID;      // MUST be set
        const SECRET_KEY = process.env.TEST_CLIENT_SECRET;  // MUST be set

        if (!APP_ID || !SECRET_KEY) {
          throw new Error("❌ Cashfree API Keys Missing");
        }

        const orderId = "order_" + Date.now();

        const res = await axios.post(
          "https://sandbox.cashfree.com/pg/orders",    // ⬅ TEST URL
          {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
              customer_id: customerId || "guest",
              customer_phone: "9999999999",    // test value ok
              customer_email: "test@example.com"
            }
          },
          {
            headers: {
              "x-api-version": "2022-09-01",
              "x-client-id": APP_ID,
              "x-client-secret": SECRET_KEY,
              "Content-Type": "application/json"
            }
          }
        );

        return {
          orderId,
          orderToken: res.data.order_token
        };

      } catch (err) {
        console.log("ORDER ERROR →", err.response?.data || err.message);
        throw new Error("Order Creation Failed: " + (err.response?.data?.message || err.message));
      }
    }
  }
};
