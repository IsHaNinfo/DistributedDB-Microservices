const amqp = require("amqplib");
// const { testFun } = require("./controllers/UserController");
let channel;
const { userAuth } = require("./middleware/requireAuth.js")

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
                var isError = false;
                const id = await userAuth(parsedData.payload);
                console.log(id, "id");
                if (id === "User not found" || id === "Token is expired" || id === "Authentication failed") {
                    isError = true;
                }
                channel.ack(data);

                channel.sendToQueue(
                    "order",
                    Buffer.from(
                        JSON.stringify({

                            operation: "userDetails",
                            // payload: { _id: id, isError: isError }
                            payload: { _id: "122", isError: false }

                        })
                    )
                );



            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });



}

module.exports = {
    connect
};