const mongoose = require("mongoose");

// store schema
const storeSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    Price: {
      type: Number,
      required: true,
      trim: true,
    },
    BodyLocation: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    CompanyName: {
      type: String,
      required: true,
    },
    CompanyURL: {
      type: String,
    },
    CompanyMappingLocation: {
      type: String,
    },
    CompanyCity: {
      type: String,
    },
    CompanyUSState: {
      type: String,
    },
    CompanyCountry: {
      type: String,
    },
    Source: {
      type: String,
    },
    Link: {
      type: String,
    },
    Duplicatenote1: {
      type: String,
    },
    productnumber: {
      type: Number,
      required: true,
    },
    Image: {
      type: String,
      required: true,
    },
    inCart: {
      type: Boolean,
    },
    count: {
      type: Number,
    },
    total: {
      type: Number,
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
