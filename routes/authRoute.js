const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const validation = require("../middlewares/validation");
const verifyToken = require("../middlewares/verifyToken");

// GET ALL USERS
router.get("/users", verifyToken, userController.getAllUsers);

// GET CURRENT USER
router.get("/get-current-user", verifyToken, userController.getCurrentUser);

// REGISTER
router.post("/register", validation.usersValidation(), userController.register);

// LOGIN
router.post("/login", userController.login);

module.exports = router;
