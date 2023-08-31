const amqp = require("amqplib");
// const { testFun } = require("./controllers/UserController");
let channel;

async function connect() {
    try {
        const amqpServer = "amqp://localhost:5672";
        const connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("user");
    } catch (e) {
        console.log(e);
    }

    channel.consume("user", async (data) => {
        try {
            data = JSON.parse(data.content);
            if (data.operation === "authenticate") {
               
                console.log(data.payload,"payload");
            } else if (data.operation === "updateUser") {
                // Handle updateUser operation if needed
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

}

const fun = async (req, res, next) => {
    channel.sendToQueue(
        "inventory",
        Buffer.from(
            JSON.stringify({
                text: "sample text",
            })
        )
    );

    //call the controllers
    channel.consume("user", (data) => {
        data = JSON.parse(data.content);
        console.log(data);
    });
    next();
};







module.exports = {
    connect,
    fun
};