const express = require('express')
const router = require('express-promise-router')()
const orderController = require('../controllers/order.controller')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')


router.get('/:status', customPassport.passportJWT, orderController.index)
router.post('/', customPassport.passportJWT, orderController.newOrder)
router.get('/details/:id', customPassport.passportJWT, orderController.detailsOrder)
router.post('/update/delivering', orderController.deliveringOrder)
router.post('/update/delivered', orderController.deliveredOrder)


module.exports = router