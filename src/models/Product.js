const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        size: [
            {
                type: Number
            }
        ],
        color: [
            {
                type: String
            }
        ],
        image: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    },
    {
        timestamps: true,
        collection: "products"
    }
)


const Product = mongoose.model('Product', ProductSchema)
module.exports = Product