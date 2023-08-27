const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const db = require('./models')
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

db.sequelize.sync().then((req) =>{
    app.listen(process.env.PORT,() =>{
        console.log(`server up and running on ${process.env.PORT}`)
    })
})


