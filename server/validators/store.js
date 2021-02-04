const { check } = require("express-validator");

exports.storeCreateValidator = [
  check("Name").not().isEmpty().withMessage("Title is required"),
  check("Price").not().isEmpty().withMessage("URL is required"),
  check("inStock").not().isEmpty().withMessage("Enter quantity in stock"),
  check("BodyLocation")
    .not()
    .isEmpty()
    .withMessage("Body Location is required"),
  check("Category").not().isEmpty().withMessage("Pick a category"),
  check("CompanyName").not().isEmpty().withMessage("Company Name is required"),
  check("productnumber")
    .not()
    .isEmpty()
    .withMessage("Product number is required"),
  check("Image").isLength({ min: 1 }).withMessage("Image is required"),
];

exports.storeUpdateValidator = [
  check("Name").not().isEmpty().withMessage("Name is required"),
  check("Price").not().isEmpty().withMessage("Price is required"),
  check("inStock").not().isEmpty().withMessage("Enter quantity in stock"),
  check("BodyLocation")
    .not()
    .isEmpty()
    .withMessage("Body Location is required"),
  check("Category").not().isEmpty().withMessage("Pick a category"),
  check("CompanyName").not().isEmpty().withMessage("Company Name is required"),
  check("productnumber")
    .not()
    .isEmpty()
    .withMessage("Product number is required"),
  check("Image").isLength({ min: 1 }).withMessage("Image is required"),
];
