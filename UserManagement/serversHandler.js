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
            if (!data) {
                // Handle the case when no data is received
                return;
            }

            const content = data.content.toString();
            const parsedData = JSON.parse(content);

            if (parsedData.operation === "authenticate") {
                console.log(parsedData.payload, "payload");
                channel.ack(data);

                channel.sendToQueue(
                    "order",
                    Buffer.from(
                        JSON.stringify({
                            operation: "userDetails",
                            payload: { _id: "1234" }
                        })
                    )
                );

                // Acknowledge the message to remove it from the queue

            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });



}

module.exports = {
    connect
};