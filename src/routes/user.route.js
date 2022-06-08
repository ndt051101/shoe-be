const router = require("express-promise-router")();
const userController = require("../controllers/user.controller");
const {
    validateParam,
    validateBody,
    schemas,
} = require("../utils/routerValidate");
const passport = require("passport");
const passportConfig = require("../middlewares/passport");
const customPassport = require("../middlewares/customPassport");

router.get("/", userController.index);
router.post(
    "/signup",
    validateBody(schemas.authSignUpSchema),
    userController.signUp
);
router.post(
    "/signin",
    validateBody(schemas.authSignInSchema),
    customPassport.passportLocal,
    userController.signIn
);
router.post(
    "/admin/signin",
    customPassport.passportLocalAdmin,
    userController.signInAdmin
);
router.post("/logout", customPassport.passportJWT, userController.logout);
router.get("/profile", customPassport.passportJWT, userController.getProfile);
router.patch(
    "/profile",
    customPassport.passportJWT,
    userController.updateProfile
);

router.post(
    "/",
    validateBody(schemas.authNewUserSchema),
    userController.newUser
);

router.put(
    "/edit",
    validateBody(schemas.authEditUserSchema),
    userController.editUser
);

router.delete("/delete", userController.deleteUser);

module.exports = router;
