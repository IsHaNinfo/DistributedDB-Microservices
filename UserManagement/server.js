require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());



mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to db & listening on Port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });



///-------------------------


const amqp = require("amqplib");
var channel, connection;
async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("user");
}
connect();



const fun = async (req, res, next) => {

  channel.sendToQueue(
    "inventory",
    Buffer.from(
      JSON.stringify({
        text: "sample text"
      })
    )
  );

  channel.consume("user", (data) => {
    data = JSON.parse(data.content);
    console.log(data)
  })  
  next();
};

const router = express.Router();
const { createUser } = require("./controllers/UserController");
router.post("/createUser", fun, createUser);


app.use("/api", router);


