const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login first");
       return res.redirect("/login");
    }
    next();
}
module.exports.savedUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async(req,res,next)=>{
     let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have the permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    console.log("working");
    let {err} = listingSchema.validate(req.body);
    if(err){
        let errMsg = err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else {
        next();
    }
}
module.exports.validateReview = (req,res,next)=>{
    let {err} = reviewSchema.validate(req.body);
    if(err){
        let errMsg = err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error","You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}