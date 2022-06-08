const express = require('express')
const router = require('express-promise-router')()
const notifyController = require('../controllers/notify.controller')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')



router.get('/', customPassport.passportJWT, notifyController.getNotify)
router.post('/', notifyController.index)


module.exports = router