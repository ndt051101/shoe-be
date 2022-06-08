const Order = require('../models/Order')
const OrderInfo = require('../models/OrderInfo')
const Notify = require('../models/Notify')
const NotifyController = require('./notify.controller')
const makeID = require('../utils/makeID')
const moment = require('moment')



const index = async (req, res, next) => {
    
    // const orders = await Order.find(
    //     { status: req.params.status },
    //     { code: 1, ordersInfo: 1, total: 1, createdAt: 1 }
    // )


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

const newOrder = async (req, res, next) => {

    const { orderList, name, phone, address, subTotal, shipping, total } = req.body
    
    console.log({
        ...req.body,
        ...req.headers
    })

    const newOrderInfo = await OrderInfo.insertMany(orderList)

    const listId = newOrderInfo.map(item => item._id)

    const newOrder = new Order({
        code: makeID(7).toLocaleUpperCase(),
        user: req.user._id,
        name,
        phone,
        address,
        ordersInfo: listId,
        subTotal,
        shipping,
        total
    })
    await newOrder.save()

    return res.status(201).json({ 
        success: true,
        message: 'Order Success'
    })
}

const detailsOrder = async (req, res, next) => {

    const { id } = req.params

    const detailsOrder = await Order.findOne({
        _id: id,
        user: req.user._id
    })
    .populate({
        path: 'ordersInfo',
        model: 'OrderInfo',
        select: { '__v': 0, 'createdAt': 0, 'updatedAt': 0},
        populate: {
            path: 'product',
            model: 'Product',
            select: { '_id': 1, 'name': 1, 'image': 1}
        }
    })

    return res.status(200).json(detailsOrder)
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

module.exports = {
    index,
    newOrder,
    detailsOrder,
    deliveringOrder,
    deliveredOrder
}