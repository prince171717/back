import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  clientId: String,
  amount: Number,
  fulfillmentId: String,
  status: { type: String, default: "pending" },
});

export default mongoose.model("Order", orderSchema);