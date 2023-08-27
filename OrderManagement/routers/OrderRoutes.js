const express = require('express');
const orderRoutes = express.Router();
const {addOrder,updateOrder} = require('../controllers/OrderContoller')

orderRoutes.post('/newOrder',addOrder);
orderRoutes.patch('/updateOrder',updateOrder);

module.exports = orderRoutes