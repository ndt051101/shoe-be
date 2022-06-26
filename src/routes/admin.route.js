const express = require('express')
const router = require('express-promise-router')()
const adminController = require('../controllers/admin.controller')
const productController = require('../controllers/product.controller')
const categoryController = require('../controllers/category.controller')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')


// order
router.get('/order/:status', customPassport.passportJWTAdmin, adminController.index)
router.post('/order/delivering', customPassport.passportJWTAdmin, adminController.deliveringOrder)
router.post('/order/delivered', customPassport.passportJWTAdmin, adminController.deliveredOrder)

// product
router.get("/product", customPassport.passportJWTAdmin, productController.getProduct);
router.post("/product", customPassport.passportJWTAdmin, productController.upload, productController.newProduct);
router.put("/product/edit", customPassport.passportJWTAdmin, productController.upload, productController.editProduct);
router.delete("/product/delete", customPassport.passportJWTAdmin, productController.deleteProduct);

// category
router.get("/category", customPassport.passportJWTAdmin, categoryController.index);
router.post("/category", customPassport.passportJWTAdmin, categoryController.newCategory);
router.put("/category/edit", customPassport.passportJWTAdmin, categoryController.editCategory);
router.delete("/category/delete", customPassport.passportJWTAdmin, categoryController.deleteCategory);



module.exports = router