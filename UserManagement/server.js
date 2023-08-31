require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect, fun } = require("./serversHandler"); // Adjust the path accordingly

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => {
    connect(); // Call the connect function here
    app.listen(process.env.PORT, () => {
      console.log("Connected to db & listening on Port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const router = express.Router();
const { createUser } = require("./controllers/UserController");
router.post("/createUser", fun, createUser);

app.use("/api", router);
