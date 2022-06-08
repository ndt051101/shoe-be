const mongoose = require('mongoose')
const Schema = mongoose.Schema



const OrderSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        ordersInfo: [{
            type: Schema.Types.ObjectId,
            ref: 'OrderInfo'
        }],
        status: {
            type: Number,
            default: 0
        },
        subTotal: {
            type: Number,
            required: true
        },
        shipping: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        deliveryTime: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        collection: "orders"
    }
)


const Order = mongoose.model('Order', OrderSchema)
module.exports = Order