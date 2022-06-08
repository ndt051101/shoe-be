const userRouter = require('./user.route')
const categoryRouter = require('./category.route')
const productRouter = require('./product.route')
const orderRouter = require('./order.route')
const notifyRouter = require('./notify.route')
const adminRouter = require('./admin.route')


const route = (app) => {

    app.use('/api/auth', userRouter)
    app.use('/api/category', categoryRouter)
    app.use('/api/product', productRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/notification', notifyRouter)
    app.use('/api/admin', adminRouter)
    
    app.get('/', (req, res, next) => {
        return res.status(200).json({
            success: true,
            message: 'Server is ok!'
        })
    })

    app.use((req, res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })
    
    app.use((err, req, res, next) => {
        console.log(err)
        const status = err.status || 500
        return res.status(status).json({
            error: {
                message: err.message
            }
        })
    })
}

module.exports = route