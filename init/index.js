const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/TravelNest');
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ 
        ...obj, 
        owner : '6783c1da5f33a39cc6a74863',
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();