import mongoose from "mongoose";
import moment from "moment";

const priceSchema = new mongoose.Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
   formattedTime: {
    type: String,
    default: () => moment().format("DD MMM YYYY, hh:mm A"), // for display
  },
});

export const Price = mongoose.model("Price", priceSchema);
