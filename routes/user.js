const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { renderSignupForm, signup, renderLoginForm, login, logout } = require("../controllers/users.js");

// Signup Routes
router.route("/signup")
    .get(renderSignupForm)
    .post(wrapAsync(signup));

// Login Routes
router.route("/login")
    .get(renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }), login);

// Logout Route
router.get("/logout", logout);

module.exports = router;
