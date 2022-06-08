const router = require("express-promise-router")();
const categoryController = require("../controllers/category.controller");
const {
    validateParam,
    validateBody,
    schemas,
} = require("../utils/routerValidate");
const passport = require("passport");
const passportConfig = require("../middlewares/passport");
const customPassport = require("../middlewares/customPassport");

router.get("/", categoryController.index);
router.post("/", categoryController.newCategory);
router.get("/:_id", categoryController.getProductByCategory);
router.put("/edit", categoryController.editCategory);
router.delete("/delete", categoryController.deleteCategory);

module.exports = router;
