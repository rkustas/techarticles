const mongoose = require("mongoose");

// store schema
const storeSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Price: {
      type: Number,
    },
    BodyLocation: {
      type: String,
    },
    Category: {
      type: String,
    },
    CompanyName: {
      type: String,
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
    id: {
      type: Number,
    },
    Image: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
