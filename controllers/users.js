const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password, confirmPassword} = req.body;
        if(password !== confirmPassword){
            req.flash("error", "Password and Confirmed Password should be the same!");
            return res.redirect("/signup"); 
        }
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);

        // signup -> login automatically 
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to TravelNest!");
            res.redirect("/listings");
        })
        
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome back to TravelNest!");
    
    let redirectUrl = res.locals.redirectUrl || "/listings";  // save redirecturl if not present then redirect to /listings
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};