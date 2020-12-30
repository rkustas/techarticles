const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// category schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    // Unique url
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    image: {
      url: String,
      key: String,
    },
    content: {
      // Rich text storage
      type: {},
      min: 20,
      max: 2000000,
    },
    // Query and find a user that posted content
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
