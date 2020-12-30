const Category = require("../models/category");
const Link = require("../models/link");
const slugify = require("slugify");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const fs = require("fs");

// s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.create = (req, res) => {
  // Using Json data instead of form
  const { name, image, content } = req.body;

  // Convert image to base64, smaller image, new buffer data, data:image and base64 replaced with empty string
  const base64data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Add a slug to the name
  const slug = slugify(name);
  // Instantiate a Category
  let category = new Category({ name, content, slug });

  // Get image type
  const type = image.split(";")[0].split("/")[1];
  // Params for base64 image
  const params = {
    Bucket: "hackrio",
    Key: `category/${uuidv4()}.${type}`,
    Body: base64data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };
  // Upload image
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Upload to s3 failed" });
    }
    console.log("AWS UPLOAD RES DATA", data);
    category.image.url = data.Location;
    category.image.key = data.Key;

    // Posted by
    category.postedBy = req.user._id;

    // save to db
    category.save((err, success) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Duplicate category" });
      }
      return res.json(success);
    });
  });
};

// exports.create = (req, res) => {
//   // Create a form
//   let form = new formidable.IncomingForm();
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Image could not upload",
//       });
//     }
//     // console.table({err, fields, files})
//     // Pull out fields and files, destructure
//     const { name, content } = fields;
//     const { image } = files;

//     // Add a slug to the name
//     const slug = slugify(name);
//     // Instantiate a Category
//     let category = new Category({ name, content, slug });

//     if (image.size > 2000000) {
//       return res.status(400).json({
//         error: "Image should be less than 2mb",
//       });
//     }
//     // upload image to s3
//     const params = {
//       Bucket: "hackrio",
//       Key: `category/${uuidv4()}`,
//       Body: fs.readFileSync(image.path),
//       ACL: "public-read",
//       ContentType: `image/jpg`,
//     };

//     s3.upload(params, (err, data) => {
//       if (err) {
//         console.log(err);
//         res.status(400).json({ error: "Upload to s3 failed" });
//       }
//       console.log("AWS UPLOAD RES DATA", data);
//       category.image.url = data.Location;
//       category.image.key = data.Key;

//       // save to db
//       category.save((err, success) => {
//         if (err) {
//           console.log(err);
//           res.status(400).json({ error: "Duplicate category" });
//         }
//         return res.json(success);
//       });
//     });
//   });
// };

// exports.create = (req, res) => {
//     const { name, content } = req.body;
//     const slug = slugify(name);
//     const image = {
//         url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
//         key: '123'
//     };

//     const category = new Category({ name, slug, image });
//     category.postedBy = req.user._id;

//     category.save((err, data) => {
//         if (err) {
//             console.log('CATEGORY CREATE ERR', err);
//             return res.status(400).json({
//                 error: 'Category create failed'
//             });
//         }
//         res.json(data);
//     });
// };

exports.list = (req, res) => {
  //List all of the categories
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Categories could not load",
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  // Grab slug
  const { slug } = req.params;
  // For pagination and infinate scroll
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  // Find links per category
  Category.findOne({ slug })
    .populate("postedBy", "_id name username")
    .exec((err, category) => {
      if (err) {
        return res.status(400).json({
          error: "Could not load category",
        });
      }
      // res.json(category);
      Link.find({ categories: category })
        .populate("postedBy", "_id name username")
        .populate("categories", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec((err, links) => {
          if (err) {
            return res.status(400).json({
              error: "Could not load links of a category",
            });
          }
          res.json({ category, links });
        });
    });
};

exports.update = (req, res) => {
  // Need category slug to find from db
  const { slug } = req.params;
  // More fields from req.body
  const { name, image, content } = req.body;

  // Convert image to base64, smaller image, new buffer data, data:image and base64 replaced with empty string
  const base64data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Get image type
  const type = image.split(";")[0].split("/")[1];

  // Find category based on slug
  Category.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: "Could not find category to update",
        });
      }
      console.log("Updated", updated);
      // Image
      if (image) {
        // Remove image if one exists before uploading new image
        const deleteParams = {
          Bucket: "hackrio",
          Key: `${updated.image.key}`,
        };

        s3.deleteObject(deleteParams, function (err, data) {
          if (err) console.log("S3 delete error", err);
          else console.log("S3 deleted during update", data);
        });

        // handle upload params

        const params = {
          Bucket: "hackrio",
          Key: `category/${uuidv4()}.${type}`,
          Body: base64data,
          ACL: "public-read",
          ContentEncoding: "base64",
          ContentType: `image/${type}`,
        };
        // Upload to S3
        s3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
            res.status(400).json({ error: "Upload to s3 failed" });
          }
          console.log("AWS UPLOAD RES DATA", data);
          updated.image.url = data.Location;
          updated.image.key = data.Key;

          // save to db
          updated.save((err, success) => {
            if (err) {
              console.log(err);
              res.status(400).json({ error: "Duplicate category" });
            }
            res.json(success);
          });
        });
      } else {
        res.json(updated);
      }
    }
  );
};

exports.remove = (req, res) => {
  const { slug } = req.params;

  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not delete category",
      });
    }
    // Remove image if one exists before uploading new image
    const deleteParams = {
      Bucket: "hackrio",
      Key: `${data.image.key}`,
    };

    s3.deleteObject(deleteParams, function (err, data) {
      if (err) console.log("S3 delete error", err);
      else console.log("S3 deleted during update", data);
    });

    res.json({
      message: "Category deleted successfully",
    });
  });
};
