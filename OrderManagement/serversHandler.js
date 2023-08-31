const amqp = require("amqplib");
let channel;

async function connect() {
    try {
        const amqpServer = "amqp://localhost:5672";
        const connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("order");
    } catch (e) {
        console.log(e);
    }


}

const authenticateUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: "Authorization token required" });
        }
        const token = authorization.split(" ")[1];
        channel.sendToQueue(
            "user",
            Buffer.from(
                JSON.stringify({
                    operation: "authenticate",
                    payload: token
                })
            )
        );
        await new Promise((resolve, reject) => {
            channel.consume("order", (data) => {
                if (data) {
                    try {
                        data = JSON.parse(data.content);
                        if (data.operation === "userDetails") {
                            if (data.payload._id) {
                                console.log(data.payload._id);
                                req.userId = data.payload._id;
                            } else {
                                res.status(401).json({ error: "Request is not authorized" });
                            }
                        }
                    } catch (error) {
                        console.error("Error processing message:", error);
                    } finally {
                        resolve();
                    }
                }
            }, {
                noAck: true
            });
        });
        next();
    } catch (err) {
        console.log(err);
    }
};





module.exports = {
    connect,
    authenticateUser
};
