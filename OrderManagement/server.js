const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const db = require('./models')
const orderRoutes = require('./routers/OrderRoutes')
const amqp = require("amqplib");

require('dotenv').config();


app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

app.use('/order', orderRoutes)

db.sequelize.sync({ alter: true }).then((req) => {
    app.listen(process.env.PORT, () => {
        console.log(`server up and running on ${process.env.PORT}`)
    })
})


var connection;
var channel;

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("inventory");
}

connect().then(() => {
    channel.consume("inventory", (data) => {
        console.log("Consuming");
        const { text } = JSON.parse(data.content);
        console.log(text);
        
        channel.ack(data);
        channel.sendToQueue(
            "user",
            Buffer.from(JSON.stringify({ respond: "sample respond" }))
        );
    });
});

