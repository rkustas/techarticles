const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productCategoryschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productCategory", productCategoryschema);
