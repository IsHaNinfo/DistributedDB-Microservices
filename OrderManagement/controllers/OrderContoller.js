const { Order } = require('../models')
const axios = require('axios');

const addOrder = async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: "Authorization token required" });
        }
        const token = authorization.split(" ")[1];
        await axios
            .post("http://localhost:4000/api/user/authUser", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(async response => {
                const userId = response.data;
                console.log(userId);

                if (!userId) {
                    console.log("User not found")
                }
                const newOrder = await Order.create({
                    user_id: userId._id,
                    product_id: req.body.product_id,
                    qty: req.body.qty
                })
                if (newOrder) {
                    return res.status(201).json({
                        message: "order added successfully"
                    })
                } else {
                    return res.status(400).json({
                        message: "could not add order"
                    })
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error("Server Error:", error.response.data.error);
                    return res.status(error.response.status).json({
                        message: error.response.data.error
                    });
                } else {
                    return res.status(500).json({
                        message: "Error while authenticating user"
                    });
                }
                
            });
    } catch (err) {
        console.log("error" + err)
        return res.status(500).json({
            message: "internal error"
        })
    }
};

const updateOrder = async (req, res) => {
    try {
        const { order_id, qty } = req.body;
        console.log("order " + order_id)
        const order = await Order.findByPk(order_id)
        if (!order) {
            res.status(400).json({
                error: "order not found"
            })
        }
        order.qty = qty;
        const update = await order.save()
        if (update) {
            res.status(200).json({
                message: "quentity updated successfully"
            })
        } else {
            res.status(400).json({
                error: "could not update db"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: "internal error occured"
        })

    }
};
const getOrderById = async (req, res) => {
    const { user_id } = req.query;
    console.log("user: " + user_id)
    try {
        const userOrders = await Order.findAll({ where: { user_id: user_id } })
        if (userOrders) {
            res.status(200).json({
                data: userOrders
            })
        } if (!userOrders) {
            res.status(400).json({
                error: "user not found"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: "internal error occured"
        })
    }
};

const deleteOrder = async (req, res) => {
    const { order_id } = req.body;
    try {
        const getOrder = await Order.findByPk(order_id)
        if (!getOrder) {
            res.status(400).json({
                error: "order not found"
            })
        }
        const deleteOrder = await getOrder.destroy()
        if (deleteOrder) {
            res.status(200).json({
                message: "Order deleted successfully"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal error occured"
        })
    }
}



module.exports = { addOrder, updateOrder, getOrderById, deleteOrder }
