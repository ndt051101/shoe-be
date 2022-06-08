const express = require('express')
const router = require('express-promise-router')()
const orderController = require('../controllers/order.controller')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')


router.get('/order/:status', customPassport.passportJWTAdmin, orderController.index)
router.post('/order/delivering', customPassport.passportJWTAdmin, orderController.deliveringOrder)
router.post('/order/delivered', customPassport.passportJWTAdmin, orderController.deliveredOrder)


module.exports = router