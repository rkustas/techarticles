const productCategory = require("../models/productCategories");
const Store = require("../models/store");

exports.create = async (req, res) => {
  //Create a product category
  try {
    const { name } = req.body;

    //   Instantiate a new category
    const newCategory = new productCategory({ name });

    res.json({
      msg: "Success!  Created a new category",
      newCategory,
    });

    // Save the category
    await newCategory.save();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.list = async (req, res) => {
  //List product categories
  try {
    await productCategory.find({}).exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Product Categories could not load",
        });
      }
      res.json({ categories: data });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  //Update product categories
  try {
    const { id } = req.params;
    const { name } = req.body;

    const newCategory = await productCategory.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({
      msg: "Success!  Category updated!",
      category: {
        ...newCategory._doc,
        name,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  //Remove product categories
  try {
    const { id } = req.params;

    const products = await Store.findOne({ category: id });
    if (products)
      return res
        .status(400)
        .send("Please delete all products with a relationship");

    await productCategory.findByIdAndDelete(id);

    res.json({ msg: "Success!  Category deleted!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
