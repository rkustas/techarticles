const { check } = require("express-validator");

exports.orderCreateValidator = [
  check("address").not().isEmpty().withMessage("Address is required"),
  check("mobile").not().isEmpty().withMessage("Mobile is required"),
  check("cart").not().isEmpty().withMessage("Cart info is required"),
  check("total").not().isEmpty().withMessage("A total is required"),
];
