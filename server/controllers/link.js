// Require link model
const Link = require("../models/link");
const User = require("../models/user");
const Category = require("../models/category");
// Import AWS SDK
const AWS = require("aws-sdk");

// Email params
const { linkPublishedParams } = require("../helpers/email");

const slugify = require("slugify");

// Update AWS settings
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create SES object
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// Create, list, read, update, remove
exports.create = (req, res) => {
  // Create a new upload post
  const { title, url, categories, type, medium } = req.body;
  //   console.table({ title, url, categories });
  // Dont need to format or use slugify for url since it is a valid url already
  const slug = url;
  //   Using let because the Link is changing and updating, can't use const
  let link = new Link({
    title,
    url,
    categories,
    type,
    medium,
    slug,
  });
  // Receive request user id from authorization since user is required to sign in to make a post
  link.postedBy = req.user._id;
  //   Saving the link to Mongo
  link.save((err, data) => {
    if (err) {
      // Once a return is found then thats it, code stops, so no need to include else
      return res.status(400).json({
        error: "Link already exists",
      });
    }
    res.json({
      msg: "Link Created!",
      data,
    });

    // Use AWS SES to send mass email for new link categories
    // Find all users based on one or more categories
    User.find({ categories: { $in: categories } }).exec((err, users) => {
      if (err) {
        throw new Error(err);
        console.log("Error finding users to send email on link creation");
      }

      // Once user found, we want to find the categories as well by id
      Category.find({ _id: { $in: categories } }).exec((err, result) => {
        // Send category, loop through category to show information...name,image,etc.
        data.categories = result;

        // Loop throuhg until we reach limit
        for (let i = 0; i < users.length; i++) {
          const params = linkPublishedParams(users[i].email, data);
          const sendEmail = ses.sendEmail(params).promise();

          sendEmail
            .then((success) => {
              console.log("Email submitted to SES", success);
              return;
            })
            .catch((failure) => {
              console.log("Email failed", failure);
              return;
            });
        }
      });
    });
  });
};

exports.list = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Link.find({})
    .populate("postedBy", "name")
    .populate("categories", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Could not list links",
        });
      }
      res.json(data);
    });
};
exports.read = (req, res) => {
  const { id } = req.params;
  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error finding link",
      });
    }
    res.json(data);
  });
};

exports.listAll = async (req, res) => {
  try {
    await Link.find({}).exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Could not list links",
        });
      }
      res.json(data);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, medium } = req.body;

  const updatedLink = { title, url, categories, type, medium };

  // Update the link
  Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: "Error updating link",
        });
      }
      res.json({
        updated,
        msg: "Link updated!",
      });
    }
  );
};

exports.remove = (req, res) => {
  // Get id
  const { id } = req.params;
  Link.findOneAndRemove({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error removing link",
      });
    }
    res.json({
      message: "Link removed successfully",
    });
  });
};

exports.clickCount = (req, res) => {
  // Send link Id from client to server
  const { linkId } = req.body;
  // Special increment by one method
  Link.findByIdAndUpdate(
    linkId,
    { $inc: { clicks: 1 } },
    { upsert: true, new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Could not update view count",
      });
    }
    return res.json(result);
  });
};

exports.popular = (req, res) => {
  // find links and sort by popularity
  Link.find({})
    .populate("postedBy", "name")
    .sort({ clicks: -1 })
    .limit(5)
    .exec((err, links) => {
      if (err) {
        return res.status(400).json({
          error: "Links not found",
        });
      }
      res.json(links);
    });
};

exports.popularInCategory = (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  Category.findOne({ slug }).exec((err, category) => {
    // Find categories
    if (err) {
      return res.status(400).json({
        error: "Could not load categories",
      });
    }
    // Sort links by category
    Link.find({ categories: category })
      .populate("postedBy", "name")
      .sort({ clicks: -1 })
      .limit(3)
      .exec((err, links) => {
        if (err) {
          return res.status(400).json({
            error: "Links not found",
          });
        }
        res.json(links);
      });
  });
};
