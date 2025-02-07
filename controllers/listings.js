const Listing = require("../models/listing.js");
const axios = require("axios");

// Index Route Logic
module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

// Render New Listing Form
module.exports.renderNewForm = async (req, res) => {
  const response = await axios.get(
    "http://api.geonames.org/countryInfoJSON?lang=en&username=lakshay187"
  );
  const countries = response.data.geonames.map(
    (country) => country.countryName
  );
  countries.sort();

  res.render("./listings/new.ejs", { countries });
};

// Create New Listing
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// Show Specific Listing
module.exports.showListing = async (req, res) => {
  let listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// Render Edit Listing Form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  const response = await axios.get(
    "http://api.geonames.org/countryInfoJSON?lang=en&username=lakshay187"
  );
  const countries = response.data.geonames.map(
    (country) => country.countryName
  );
  countries.sort();

  // Lowering the quality for preview and adding dimensions
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_200");

  res.render("./listings/edit.ejs", { listing, countries, originalImageUrl });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Update fields from req.body
  listing.set(req.body.listing);

  // Handle new image if uploaded
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

// Search Listings by Location
module.exports.searchListings = async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.redirect("/listings"); // If no location is entered, redirect to all listings
  }

  // Find listings where location matches the search query (case-insensitive)
  const searchResults = await Listing.find({
    location: new RegExp(location, "i"),
  });

  res.render("listings/search", { searchResults, query: location });
};
