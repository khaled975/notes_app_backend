const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");
const httpStatusText = require("../utils/httpStatusText");
module.exports = (req, res, next) => {
  const headersAuth =
    req.headers["Authorization"] || req.headers["authorization"];

  const token = headersAuth && headersAuth.split(" ")[1];
  if (!token) {
    const error = errorHandler.create(
      401,
      httpStatusText.FAIL,
      "You Are Not Authorized"
    );
    return next(error);
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.currentUser = decodedToken;
    return next();
  } catch (err) {
    const error = errorHandler.create(
      401,
      httpStatusText.FAIL,
      "You Are Not Authenticated"
    );
    return next(error);
  }
};
