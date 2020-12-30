const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// category schema
const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    url: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    // Unique url
    slug: {
      type: String,
      lowercase: true,
      index: true,
      required: true,
    },
    // Query and find a user that posted content
    postedBy: {
      type: ObjectId,
      //   Ref to user model
      ref: "User",
    },
    categories: [
      {
        type: ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    type: {
      type: String,
      default: "Free",
    },
    medium: {
      type: String,
      default: "Video",
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
