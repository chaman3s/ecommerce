import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // SAVE10, FLAT50
  type: { type: String, enum: ["PERCENT","FLAT"], required: true }, 
  value: { type: Number, required: true }, // 10 = 10% or 50 = ₹50 off
  minOrderAmount: { type: Number, default: 0 }, // Apply only if total >= min
  maxDiscount: { type: Number, default: null }, // optional: cap % discount
  expiry: { type: Date }, // optional expiry date
  status: { type: Boolean, default: true } // activate/deactivate coupon
},{ _id:false });

const cityDeliverySchema = new mongoose.Schema({
  city: { type: String, required: true, lowercase:true },
  charge: { type: Number, required: true } // delivery price
},{ _id:false });

const PriceSchema = new mongoose.Schema({

  deliveryRates: [cityDeliverySchema],     // Multiple city delivery prices

  defaultDelivery: { 
    type: Number, 
    default: 60 
  },                                       // When city not found

  coupons: [couponSchema],                 // Array of coupon objects

},{ timestamps:true });

export default mongoose.model("Price", PriceSchema);
