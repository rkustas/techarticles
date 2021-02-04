// Imports
const Store = require("../models/store");

exports.create = (req, res) => {
  //
  try {
    const {
      product_id,
      Name,
      Price,
      inStock,
      BodyLocation,
      Category,
      CompanyName,
      productnumber,
      base64,
    } = req.body;
    const product = Store.findOne({ product_id });
    if (product)
      return res.status(400).json({ err: "This product already exists" });

    const newnumber = Store.findOne({ productnumber });
    if (newnumber)
      return res.status(400).json({ err: "This productnumber already exists" });

    const newProduct = new Store({
      product_id,
      Name: Name.toLowerCase(),
      Price,
      inStock,
      BodyLocation,
      Category,
      CompanyName,
      productnumber,
      Image: base64,
    });

    newProduct.save.exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Error creating product",
        });
      }
      res.json({
        msg: "Success!  Created product!",
        data,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.read = (req, res) => {
  const { id } = req.params;
  Store.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error finding product",
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  //List all of the store items
  Store.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Items could not load",
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  //
  try {
    const { id } = req.params;
    const {
      product_id,
      Name,
      Price,
      inStock,
      BodyLocation,
      Category,
      CompanyName,
      productnumber,
      image,
    } = req.body;

    Store.findOneAndUpdate(
      { _id: id },
      {
        product_id,
        Name,
        Price,
        inStock,
        BodyLocation,
        Category,
        CompanyName,
        productnumber,
        image,
      }
    ).exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Error updating product",
        });
      }
      res.json({
        msg: "Success!  Updated product!",
        data,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.remove = (req, res) => {
  //
};
