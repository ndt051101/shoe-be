const mongoose = require('mongoose')
const Schema = mongoose.Schema


const FavoriteSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    },
    {
        timestamps: true,
        collection: "categories"
    }
)


const Favorite = mongoose.model('Favorite', FavoriteSchema)
module.exports = Favorite