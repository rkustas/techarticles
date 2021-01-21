const { check } = require("express-validator");

exports.storeCreateValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("url").not().isEmpty().withMessage("URL is required"),
  check("categories").not().isEmpty().withMessage("Pick a category"),
  check("type").not().isEmpty().withMessage("Pick a type"),
  check("medium").not().isEmpty().withMessage("Pick a medium"),
];

exports.storeUpdateValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("url").not().isEmpty().withMessage("URL is required"),
  check("categories").not().isEmpty().withMessage("Pick a category"),
  check("type").not().isEmpty().withMessage("Pick a type"),
  check("medium").not().isEmpty().withMessage("Pick a medium"),
];
