const Order = require('../models/Order')
const OrderInfo = require('../models/OrderInfo')
const Notify = require('../models/Notify')
const Product = require('../models/Product')
const NotifyController = require('./notify.controller')
const makeID = require('../utils/makeID')
const moment = require('moment')



const index = async (req, res, next) => {

    const orders = await Order.aggregate([
        {
            $match: { status: Number(req.params.status) }
        },
        {
            $project: {
                code: 1,
                total: 1,
                createdAt: 1,
                quantity: { $cond: { if: { $isArray: "$ordersInfo" }, then: { $size: "$ordersInfo" }, else: "NA"} }
            }
        },
        { 
            $sort : { createdAt : -1 } 
        }
    ])

    return res.status(200).json(orders)
}

const deliveringOrder = async (req, res, next) => {

    const { id } = req.body

    const newOrder = await Order.findByIdAndUpdate(id, {
        status: 1
    }, {new : true}).populate('user', '_id tokenDevices')

    const newNotify = await Notify.create(new Notify({
        title: 'Đã xác nhận đơn hàng',
        body: 'Đơn hàng của bạn đã được xác nhận, chờ nhận hàng nhé <3', 
        type: 1,
        user: newOrder.user._id
    }))

    const msg = await NotifyController.sendtoUser(
        newOrder.user.tokenDevices,
        {
            title: newNotify.title,
            body: newNotify.body
        }
    )

    return res.status(201).json({
        success: true,
        // newOrder,
        newNotify
        // msg
    })
}

const deliveredOrder = async (req, res, next) => {

    const { id } = req.body

    const newOrder = await Order.findByIdAndUpdate(id, {
        status: 2,
        deliveryTime: moment().format()
    }, {new : true}).populate('user', '_id tokenDevices')

    const newNotify = await Notify.create(new Notify({
        title: 'Đơn hàng đã được giao',
        body: 'Đơn hàng của bạn đã được giao.\nCảm ơn bạn đã mua hàng <3', 
        type: 2,
        user: newOrder.user._id
    }))

    const msg = await NotifyController.sendtoUser(
        newOrder.user.tokenDevices,
        {
            title: newNotify.title,
            body: newNotify.body
        }
    )

    return res.status(201).json({
        success: true,
        // newOrder,
        newNotify
        // msg
    })
}

const searchOrder = async (req, res, next) => {
    const { code, status } = req.query;


    // const productFound = await Product.aggregate([
    //     {$match: { name: { $regex : name, $options: 'i' } }},
    //     {$project: { _id: 1, name: 1, image: 1 }}d
    // ]).populate('category', 'name')

    const orders = await Order.find(
        { 
            code: { $regex: code, $options: "i" },
            status: +status
        },
        {
            code: 1,
            total: 1,
            quantity: { $cond: { if: { $isArray: "$ordersInfo" }, then: { $size: "$ordersInfo" }, else: "NA"} },
            createdAt: 1,
        }
    )

    return res.status(200).json({
        success: true,
        data: orders
    });
};

const searchProduct = async (req, res, next) => {
    const { name } = req.query;

    const products = await Product.find(
        { name: { $regex: name, $options: "i" } }
    ).populate("category", "name");

    return res.status(200).json({
        success: true,
        data: products
    });
};

module.exports = {
    index,
    deliveringOrder,
    deliveredOrder,
    searchOrder,
    searchProduct
}