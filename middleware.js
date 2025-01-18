const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

// Validation Schema Function
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

// Validate Review function 
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        let originalUrl = req.originalUrl;

        // Remove `/reviews` from the end if it exists
        if (originalUrl.endsWith("/reviews")) {
            originalUrl = originalUrl.replace("/reviews", "");
        }

        req.session.redirectUrl = originalUrl; // Save the trimmed URL
        req.flash("error", "User must be logged in!");
        return res.redirect("/login");
    }
    next();
};

// we are making this middleware because when logged in it automatically delete originalurl
module.exports.saveRedirectUrl = (req,res,next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "You are not the owner of listing!");
        return res.redirect("/listings");
    }
    next();
}