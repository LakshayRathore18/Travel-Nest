const mongoose = require("mongoose");
const Review = require("./review.js")

const listingSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description : {
        type : String,
        maxLen : 100
    },
    image : {
        url : String,
        filename : String,
    },
    price : {
        type : Number,
        required : true,
        min : 1
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
})

// Delete Middleware 
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing  ){
        await Review.deleteMany({_id : {$in : listing.reviews }});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


