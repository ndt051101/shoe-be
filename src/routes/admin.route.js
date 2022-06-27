const express = require('express')
const router = require('express-promise-router')()
const adminController = require('../controllers/admin.controller')
const productController = require('../controllers/product.controller')
const categoryController = require('../controllers/category.controller')
const userController = require('../controllers/user.controller')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')
const {
    validateParam,
    validateBody,
    schemas,
} = require("../utils/routerValidate");


// auth
router.post("/signin", customPassport.passportLocalAdmin, userController.signInAdmin);

// order
router.get('/order/search', customPassport.passportJWTAdmin, adminController.searchOrder)
router.get('/order/:status', customPassport.passportJWTAdmin, adminController.index)
router.post('/order/delivering', customPassport.passportJWTAdmin, adminController.deliveringOrder)
router.post('/order/delivered', customPassport.passportJWTAdmin, adminController.deliveredOrder)

// product
router.get("/product", customPassport.passportJWTAdmin, productController.getProduct);
router.get("/product/search", customPassport.passportJWTAdmin, adminController.searchProduct);
router.post("/product", customPassport.passportJWTAdmin, productController.upload, productController.newProduct);
router.put("/product/edit", customPassport.passportJWTAdmin, productController.upload, productController.editProduct);
router.delete("/product/delete", customPassport.passportJWTAdmin, productController.deleteProduct);

// category
router.get("/category", customPassport.passportJWTAdmin, categoryController.index);
router.post("/category", customPassport.passportJWTAdmin, categoryController.newCategory);
router.put("/category/edit", customPassport.passportJWTAdmin, categoryController.editCategory);
router.delete("/category/delete", customPassport.passportJWTAdmin, categoryController.deleteCategory);

// user
router.get("/user", customPassport.passportJWTAdmin, userController.index);
router.post("/user", customPassport.passportJWTAdmin, validateBody(schemas.authNewUserSchema), userController.newUser);
router.delete("/user", customPassport.passportJWTAdmin, userController.deleteUser);



module.exports = router