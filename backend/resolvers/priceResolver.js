import Price from "../models/Price.js";

export default {
  // 🔹 QUERIES
  Query: {

    // Fetch full pricing config (delivery + coupons)
    getPriceSettings: async () => {
      let price = await Price.findOne();
      if (!price) price = await Price.create({}); // auto-create first entry
      return price;
    },

    // Get delivery charge by city
    getDeliveryCharge: async (_, { city }) => {
      const price = await Price.findOne();
      if (!price) throw new Error("Price settings not found");

      const found = price.deliveryRates.find(
        c => c.city.toLowerCase() === city.toLowerCase()
      );

      return found ? found.charge : price.defaultDelivery;
    },

    // Validate & get discount from coupon
    validateCoupon: async (_, { code, totalAmount }) => {
      const price = await Price.findOne();
      if (!price) throw new Error("Price settings not found");

      const coupon = price.coupons.find(
        c => c.code.toUpperCase() === code.toUpperCase() && c.status === true
      );

      if (!coupon) return { valid:false, discount:0, message:"Invalid Coupon" };

      if (coupon.expiry && new Date(coupon.expiry) < new Date())
        return { valid:false, discount:0, message:"Coupon Expired" };

      if (totalAmount < coupon.minOrderAmount)
        return { valid:false, discount:0, message:"Minimum order required ₹" + coupon.minOrderAmount };

      let discount = 0;

      if (coupon.type === "FLAT") discount = coupon.value;

      if (coupon.type === "PERCENT") {
        discount = (totalAmount * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount)
          discount = coupon.maxDiscount;
      }

      return { valid:true, discount, message:"Coupon applied successfully" };
    }
  },


  // =======================
  // 🔹 MUTATIONS — DELIVERY
  // =======================
  Mutation: {

    addCityDeliveryCharge: async (_, { city, charge }) => {
      let price = await Price.findOne();
      if (!price) price = await Price.create({});

      // Check duplicates
      if (price.deliveryRates.some(c => c.city === city.toLowerCase()))
        throw new Error("City already exists");

      price.deliveryRates.push({ city:city.toLowerCase(), charge });
      await price.save();
      return price;
    },

    updateCityDeliveryCharge: async (_, { city, charge }) => {
      let price = await Price.findOne();
      if (!price) throw new Error("Price settings not found");

      const index = price.deliveryRates.findIndex(c => c.city === city.toLowerCase());
      if (index === -1) throw new Error("City not found");

      price.deliveryRates[index].charge = charge;
      await price.save();
      return price;
    },

    deleteCityDeliveryCharge: async (_, { city }) => {
      let price = await Price.findOne();
      if (!price) throw new Error("Price settings not found");

      price.deliveryRates = price.deliveryRates.filter(
        c => c.city !== city.toLowerCase()
      );

      await price.save();
      return price;
    },


    // =======================
    // 🔹 MUTATIONS — COUPONS
    // =======================

    addCoupon: async (_, { input }) => {
      let price = await Price.findOne();
      if (!price) price = await Price.create({});

      if (price.coupons.some(c => c.code === input.code))
        throw new Error("Coupon code already exists");

      price.coupons.push(input);
      await price.save();
      return price;
    },

    updateCoupon: async (_, { code, input }) => {
      let price = await Price.findOne();
      if (!price) throw new Error("Price settings not found");

      const index = price.coupons.findIndex(c => c.code === code);
      if (index === -1) throw new Error("Coupon not found");

      price.coupons[index] = { ...price.coupons[index], ...input };
      await price.save();
      return price;
    },

    deleteCoupon: async (_, { code }) => {
      let price = await Price.findOne();
      if (!price) throw new Error("Price settings not found");

      price.coupons = price.coupons.filter(c => c.code !== code);
      await price.save();
      return price;
    }
  }
};
