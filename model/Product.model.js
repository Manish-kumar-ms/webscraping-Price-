
import mongoose from "mongoose";
import moment from "moment";

const ProductSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    // formattedTime: {
    //   type: String,
    //   default: () => moment().format("DD MMM YYYY, hh:mm A"), // for display
    // },
});

export const Product = mongoose.model("Product", ProductSchema);

