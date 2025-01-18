const express = require("express");
const router = express.Router({mergeParams : true});    // mergeParams : to send id from app.js to review.js  
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, validateReview, saveRedirectUrl} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");

// Post Review 
router.post("/", saveRedirectUrl,validateReview, isLoggedIn, wrapAsync(createReview));
  
// Delete Review
router.delete("/:reviewId", isLoggedIn, wrapAsync(destroyReview))

module.exports = router;