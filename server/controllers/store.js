// Imports
const Store = require("../models/store");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.category !== "all")
      this.query.find({ category: queryObj.category });
    if (queryObj.name !== "all")
      this.query.find({ name: { $regex: queryObj.name } });
    this.query.find();
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.create = async (req, res) => {
  //
  try {
    const {
      name,
      price,
      description,
      inStock,
      bodyLocation,
      category,
      companyName,
      companyCity,
      companyUSState,
      companyCountry,
      productnumber,
      images,
    } = req.body;

    const newProduct = new Store({
      name: name.toLowerCase(),
      price,
      description,
      inStock,
      bodyLocation,
      category,
      companyName,
      companyCity,
      companyUSState,
      companyCountry,
      productnumber,
      images,
    });

    await newProduct.save();
    res.json({
      msg: "Success!  Created product!",
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

exports.list = async (req, res) => {
  try {
    //List all of the store items
    const features = new APIfeatures(Store.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const products = await features.query;
    res.json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  //
  try {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      inStock,
      bodyLocation,
      category,
      companyName,
      companyCity,
      companyUSState,
      companyCountry,
      productnumber,
      images,
    } = req.body;

    await Store.findOneAndUpdate(
      { _id: id },
      {
        name: name.toLowerCase(),
        price,
        description,
        inStock,
        bodyLocation,
        category,
        companyName,
        companyCity,
        companyUSState,
        companyCountry,
        productnumber,
        images,
      }
    );

    res.json({ msg: "Success! Product Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  //
  try {
    const { id } = req.params;

    await Store.findByIdAndDelete(id);
    res.json({ msg: "Product Deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
