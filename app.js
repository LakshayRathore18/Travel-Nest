if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const dbUrl = process.env.ATLASDB_URL

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRETCODE,
    },
    touchAfter: 24 * 3600
})

store.on("error", ()=>console.log("ERROR IN MONGODB",err));

const sessionOptions = {
    store,
    secret: process.env.SECRETCODE,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + (7*24*60*60), // milliseconds for 7 days
        maxAge : 7 * 24 * 60 * 60,
        httpOnly : true,
    },
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// Starting 
app.get(("/"),(req,res)=>{
    res.redirect("/listings");
})

// Flash Middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// Routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


// Unknown api
app.all(("*"),(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

// Error Handling MiddleWare
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs",{err});
})

app.listen(8080, () => {
    console.log(`Server is listening on port: 8080`);
});
