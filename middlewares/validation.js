const { body } = require("express-validator");

const usersValidation = () => {
  return [
    body("fullName")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please insert a valid name"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("Password should be at least 5 char"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email"),
  ];
};

module.exports = {
  usersValidation,
};
