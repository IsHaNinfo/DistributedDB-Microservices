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
        await channel.sendToQueue(
            "user",
            Buffer.from(
                JSON.stringify({
                    operation: "authenticate",
                    payload: token
                })
            )
        );

        await channel.consume("order", (data) => {
            // console.log("data from user", data);
            if (data) {
                try {
                    data = JSON.parse(data.content);

                    if (data.operation === "userDetails") {
                        if (data.payload._id) {
                            if (data.payload.isError) {
                                return res.status(401).json({ error: data.payload._id });
                            } else {
                                req.userId = data.payload._id;


                                next();
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error processing message:", error);
                }
            }
        }, {
            noAck: true
        });

        console.log("sssssssssssssssssssssss");

    } catch (err) {
        console.log(err);
    }
};



// const { authorization } = req.headers;
// const token = authorization.split(" ")[1];
// if (!authorization) {
//     data = {
//         payload: "Authorization token required",
//         isError: true
//     };

//     return data;
// }



const authUser = async (token) => {

    try {
        // console.log("Auth token", token)
        await channel.sendToQueue(
            "user",
            Buffer.from(
                JSON.stringify({
                    operation: "authenticate",
                    payload: token
                })
            )
        );

        await channel.consume("order", (data) => {
            // console.log("data from user", data);
            if (data) {
                try {
                    data = JSON.parse(data.content);

                    if (data.operation === "userDetails") {
                        if (data.payload._id) {
                            if (data.payload.isError) {
                                ;
                                return ({
                                    payload: data.payload._id,
                                    isError: true
                                });
                            } else {

                                id = data.payload._id;
                                if (id !== '') {
                                    console.log("return", id)
                                    return ({
                                        payload: id,
                                        isError: false
                                    })

                                }

                            }
                        }
                    }
                } catch (error) {
                    console.error("Error processing message:", error);
                }
            }
        }, {
            noAck: true
        });
        // await channel.cancel(ss);


    } catch (err) {
        console.log(err);
    }
};










module.exports = {
    connect,
    authenticateUser,
    authUser
};
