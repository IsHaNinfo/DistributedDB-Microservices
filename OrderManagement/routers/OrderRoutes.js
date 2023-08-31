const express = require('express');
const orderRoutes = express.Router();
const { addOrder, updateOrder, getOrderById, deleteOrder } = require('../controllers/OrderContoller');
const { or } = require('sequelize');
const { authenticateUser } = require('../serversHandler');


orderRoutes.post('/newOrder', authenticateUser, addOrder);
orderRoutes.patch('/updateOrder', updateOrder);
orderRoutes.get('/userorders', getOrderById);
orderRoutes.delete('/deleteOrder', deleteOrder);

module.exports = orderRoutes