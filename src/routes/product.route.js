const express = require("express");
const router = require("express-promise-router")();
const productController = require("../controllers/product.controller");
const passport = require("passport");
const passportConfig = require("../middlewares/passport");
const customPassport = require("../middlewares/customPassport");

router.get("/", productController.index);
router.get("/getProduct", productController.getProduct);
router.post("/", productController.upload, productController.newProduct);
router.put("/edit", productController.upload, productController.editProduct);
router.delete("/delete", productController.deleteProduct);

router.get("/search", productController.searchProduct);
router.get("/suggest", productController.suggestProduct);
router.get(
    "/favorites",
    customPassport.passportJWT,
    productController.getFavorites
);
router.post(
    "/favorites",
    customPassport.passportJWT,
    productController.favoriteProduct
);

router.get(
    "/:_id",
    customPassport.notRequirePassportJWT,
    productController.getProductById
);

module.exports = router;
