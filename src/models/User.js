const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs') 


const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String
        },
        role: {
            type: String,
            default: 'user'
        },
        favorites: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }],
        tokenDevices: {
            type: Array,
            default: []
        },
    },
    {
        timestamps: true,
        collection: "users"
    }
)

UserSchema.pre('save', async function(next){
    try {
        // Generate a satl
        const satl = await bcrypt.genSalt(10)
        // Generate a password hash (satl + hash)
        const passwordHashed = await bcrypt.hash(this.password, satl)
        // Re-assign password hashed
        this.password = passwordHashed

        next()
    } catch (error) {
        next(error)
    }
})


UserSchema.methods.isValidPassword = async function(newPassword){
    try {
        return await bcrypt.compare(newPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}


const User = mongoose.model('User', UserSchema)
module.exports = User