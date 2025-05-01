const jwt = require("jsonwebtoken");

module.exports = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "2h",
  });
  return token;
};
