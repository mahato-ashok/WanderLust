const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js")


//POST review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));


    //DELETE ROUTE FOR REVIEW
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroyReview))
    module.exports = router; 