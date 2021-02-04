const { check } = require("express-validator");

exports.productCategoryCreateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
];
