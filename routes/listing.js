const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { 
    index, 
    renderNewForm, 
    createListing, 
    showListing, 
    renderEditForm, 
    updateListing, 
    destroyListing 
} = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});


// Index Route
router.route("/")
    .get(wrapAsync(index)) 
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(createListing)
    );
    

// Create Form Route
router.get("/new", isLoggedIn,wrapAsync(renderNewForm)); 

// Show, Update, and Delete Routes
router.route("/:id")
    .get(wrapAsync(showListing)) 
    .put(
        isLoggedIn, 
        isOwner,
        upload.single("listing[image]"), 
        validateListing, 
        wrapAsync(updateListing)
    ) 
    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing)); 

// Edit Form Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm)); 

module.exports = router;
