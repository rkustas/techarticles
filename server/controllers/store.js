// Imports
const Store = require("../models/store");

exports.create = (req, res) => {
  //
};

exports.read = (req, res) => {
  const { id } = req.params;
  Store.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error finding link",
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
};

exports.remove = (req, res) => {
  //
};
