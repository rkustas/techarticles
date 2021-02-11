const { check } = require("express-validator");

exports.storeCreateValidator = [
  check("name").not().isEmpty().withMessage("Title is required"),
  check("price").not().isEmpty().withMessage("URL is required"),
  check("inStock").not().isEmpty().withMessage("Enter quantity in stock"),
  check("bodyLocation")
    .not()
    .isEmpty()
    .withMessage("Body Location is required"),
  check("category").not().isEmpty().withMessage("Pick a category"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("companyName").not().isEmpty().withMessage("Company Name is required"),
  check("companyCity").not().isEmpty().withMessage("City is required"),
  check("companyUSState").not().isEmpty().withMessage("State is required"),
  check("companyCountry").not().isEmpty().withMessage("Country is required"),
  check("productnumber")
    .not()
    .isEmpty()
    .withMessage("Product number is required"),
];

exports.storeUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("price").not().isEmpty().withMessage("Price is required"),
  check("inStock").not().isEmpty().withMessage("Enter quantity in stock"),
  check("bodyLocation")
    .not()
    .isEmpty()
    .withMessage("Body Location is required"),
  check("category").not().isEmpty().withMessage("Pick a category"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("companyName").not().isEmpty().withMessage("Company Name is required"),
  check("companyCity").not().isEmpty().withMessage("City is required"),
  check("companyUSState").not().isEmpty().withMessage("State is required"),
  check("companyCountry").not().isEmpty().withMessage("Country is required"),
  check("productnumber")
    .not()
    .isEmpty()
    .withMessage("Product number is required"),
];
