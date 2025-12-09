import axios from "axios";

export default {
  Mutation: {
    createCashfreeOrder: async (_, { amount, customerId ,Number}) => {
      const orderId = "order_" + Date.now();

      const payload = {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: customerId || "guest_" + Date.now(),
          customer_phone: Number||"9999999999"
        }
      };

      const res = await axios.post(
        "https://sandbox.cashfree.com/pg/orders",
        payload,
        {
          headers: {
            "x-api-version": "2022-09-01",
            "x-client-id": process.env.TEST_CLIENT_ID,
            "x-client-secret": process.env.TEST_CLIENT_SECRET,
            "Content-Type": "application/json"
          }
        }
      );

      return {
        orderId,
        orderToken: res.data.order_token
      };
    }
  },

  Query: {
    verifyPayment: async (_, { orderId }) => {
      const res = await axios.get(
        `https://sandbox.cashfree.com/pg/orders/${orderId}`,
        {
          headers: {
            "x-api-version": "2022-09-01",
            "x-client-id": process.env.TEST_CLIENT_ID,
            "x-client-secret": process.env.TEST_CLIENT_SECRET,
          }
        }
      );

      return {
        orderId,
        status: res.data.order_status,
        amount: res.data.order_amount
      };
    }
  }
};
