const express = require("express");
const app = express();
const PORT = 9000;
const mongoose = require("mongoose");
const Order = require("./Order");
const amqp = require("amqplib");


var channel, connection;

mongoose.connect(
    "mongodb://localhost:27017/").then(() => {
        console.log("Connect to MongoDB")
    }).catch((err) => {
        console.log(err)
    });
app.use(express.json());

function createOrder(text) {
    console.log(text)
}

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("inventory");
}
connect().then(() => {
    channel.consume("inventory", (data) => {
        console.log("Consuming ORDER service");
        const { text } = JSON.parse(data.content);
        console.log(text);
        const newOrder = createOrder(text);
        channel.ack(data);
        channel.sendToQueue(
            "user",
            Buffer.from(JSON.stringify({ respond:"sample respond" }))
        );
    });
});

app.listen(PORT, () => {
    console.log(`Order-Service at ${PORT}`);
});
