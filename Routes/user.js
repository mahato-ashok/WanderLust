const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const{savedUrl} = require("../middleware.js");

const userControllers = require("../controllers/user.js");

router.route("/signUp")
.get(userControllers.renderSignupForm)
.post( wrapAsync(userControllers.signupUser));



router.route("/login")
.get(userControllers.renderLoginForm)
.post(savedUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),userControllers.loginUser)



router.get("/logout",userControllers.logoutUser)
module.exports = router;