const mongoose = require("mongoose");

// store schema
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    bodyLocation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyCity: {
      type: String,
      required: true,
    },
    companyUSState: {
      type: String,
      required: true,
    },
    companyCountry: {
      type: String,
      required: true,
    },
    productnumber: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
