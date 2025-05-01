const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const errorHandler = require("../utils/errorHandler");
const generateToken = require("../utils/generateToken");
const httpStatusText = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find({}, { __v: false, password: false });
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { users } });
});

const getCurrentUser = asyncWrapper(async (req, res, next) => {
  const currentUser = req.currentUser;
  const user = await User.findOne(
    { email: currentUser.email },
    { __v: false, password: false }
  );
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { user } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, errors: result.array() });
  }

  const duplicatedUser = await User.findOne({ email });
  if (duplicatedUser) {
    const error = errorHandler.create(
      400,
      httpStatusText.FAIL,
      "This email is already exists!"
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const token = generateToken({ fullName, email });
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    token,
  });
  await newUser.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  // CHECK IF EMAIL AND PASSWORD ARE PROVIDED
  if (!email || !password) {
    const error = errorHandler.create(
      400,
      httpStatusText.FAIL,
      "All Fields Are Required"
    );
    return next(error);
  }
  // CHECK IF USER EXISTED WITH PROVIDED EMAIL FROM THE USER
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    const error = errorHandler.create(
      401,
      httpStatusText.FAIL,
      "This User is not existing"
    );
    return next(error);
  }

  // CHECK IF THE PROVIDED PASSWORD FROM THE USER MATCHED PASS IN DB
  const matchedPassword = await bcrypt.compare(password, currentUser.password);
  if (!matchedPassword) {
    const error = errorHandler.create(
      400,
      httpStatusText.FAIL,
      "Email or password is incorrect!"
    );
    return next(error);
  }

  // USER FOUND IN DB AND GENERATING TOKEN FOR IT
  const token = generateToken({
    email: currentUser.email,
    id: currentUser._id,
    fullName: currentUser.fullName,
  });
  return res.status(200).json({
    statusCode: 200,
    statusText: httpStatusText.SUCCESS,
    data: { token },
  });
});

module.exports = {
  getAllUsers,
  getCurrentUser,
  login,
  register,
};
