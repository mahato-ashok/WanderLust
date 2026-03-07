
const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupUser = async(req,res,next)=>{
    try{
    const {username,email,password} = req.body;
    const newUser = new User({username,email});
     const registeredUser = await User.register(newUser,password);
     console.log(registeredUser);
     req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
     })
     
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.loginUser = async(req,res)=>{
    req.flash("success","Welcome back to wanderLust !!");
    let redirecturl = res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);
}

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are loggedout !!");
        res.redirect("/listings");

    })
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}