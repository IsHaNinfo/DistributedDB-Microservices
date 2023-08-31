const amqp = require("amqplib");
const { testFun } = require("./controllers/UserController");
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

    channel.consume("user", (data) => {
        data = JSON.parse(data.content);
        console.log(data);
    });
    console.log(testFun("sss"));
    next();
};

module.exports = {
    connect,
    fun
};
