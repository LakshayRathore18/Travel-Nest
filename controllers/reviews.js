const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview =  async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","new review created!");
    res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;

    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);
}; 