const amqp = require("amqplib");
// const { testFun } = require("./controllers/UserController");
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

const fun = async (req, res, next) => {
    channel.sendToQueue(
        "inventory",
        Buffer.from(
            JSON.stringify({
                text: "sample text",
            })
        )
    );

    channel.consume("order", (data) => {
        data = JSON.parse(data.content);
        console.log(data);
    });
    // console.log(testFun("sss"));
    next();
};

const authenticateUser = async (req, res, next) => {
    try {
        // const { authorization } = req.headers;

        // if (!authorization) {
        //     return res.status(401).json({ error: "Authorization token required" });
        // }
        // const token = authorization.split(" ")[1];
        const token = 12;
        channel.sendToQueue(
            "user",
            Buffer.from(
                JSON.stringify({
                    operation: "authenticate",
                    payload: token
                })
            )
        );

        channel.consume("order", (data) => {
            data = JSON.parse(data.content);
            channel.ack(data);
            if (data.operation === "userDetails") {
                if (data.payload._id) {
                    console.log(data);
                    req.userId = data.payload._id;
                }
                else {
                    res.status(401).json({ error: "Request is not authorized" });
                }

                
            }

        });

        next();
    } catch (err) {
        console.log(err);
    }

};





module.exports = {
    connect,
    fun, authenticateUser
};