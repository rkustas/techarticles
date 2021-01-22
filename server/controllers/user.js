const User = require("../models/user");
const Link = require("../models/link");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.read = (req, res) => {
  User.findOne({ _id: req.user._id }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    Link.find({ postedBy: user })
      .populate("categories", "name slug")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .exec((err, links) => {
        if (err) {
          return res.status(400).json({
            error: "Could not find links",
          });
        }
        // Set salt and hashed_password to undefined
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ user, links });
      });
  });
};

// Update user
exports.update = (req, res) => {
  const { name, password, avatar, categories } = req.body;
  switch (true) {
    case password && password.length < 6:
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
      break;
  }

  // Convert image to base64, smaller image, new buffer data, data:image and base64 replaced with empty string
  const base64data = new Buffer.from(
    avatar.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Get image type
  const type = avatar.split(";")[0].split("/")[1];
  // Params for base64 image
  const params = {
    Bucket: "hackrio",
    Key: `user/${uuidv4()}.${type}`,
    Body: base64data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Upload to s3 failed" });
    }
    console.log("AWS UPLOAD RES DATA", data);
    avatar.url = data.Location;
    avatar.key = data.Key;
  });

  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, avatar, password, categories },
    { new: true }
  ).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: "Could not find user to update",
      });
    }

    updated.hashed_password = undefined;
    updated.salt = undefined;
    res.json(updated);
  });
};
