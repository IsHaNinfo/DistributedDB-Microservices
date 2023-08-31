const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const db = require('./models')
const orderRoutes = require('./routers/OrderRoutes')
const { connect, fun } = require("./serversHandler");

require('dotenv').config();


app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

app.use('/order', orderRoutes)

db.sequelize.sync({ alter: true }).then((req) => {

    app.listen(process.env.PORT, () => {
        connect();
        console.log(`server up and running on ${process.env.PORT}`)
    })
})



