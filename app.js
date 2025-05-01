// DOTENV
require("dotenv").config();

// HTTP_STATUS_TEXT
const httpStatusText = require("./utils/httpStatusText");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTION).then(() => {
  console.log("connected to DB");
});

const cors = require("cors");
const express = require("express");

const app = express();

app.use(express.json());
app.use(cors());

// ROUTER
const authRouter = require("./routes/authRoute");
const notesRouter = require("./routes/notesRoute");
app.use("/", authRouter);
app.use("/", notesRouter);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    statusText: err.statusText || httpStatusText.ERROR,
    message: err.message || "UNKNOWN ERROR!",
    data: null,
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started!");
});
