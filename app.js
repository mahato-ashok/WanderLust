// if(process.env.NODE_ENV !="production"){
//     require("dotenv").config();
//     console.log(process.env.CLOUD_NAME);
// }
require("dotenv").config();
// console.log(process.env.CLOUD_API_KEY);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const listingsRoute = require("./Routes/listings.js");
const reviewsRoute = require("./Routes/review.js");
const userRoute  = require("./Routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer')



app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverride = require("method-override")
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wanderLust";
const ATLAS_URL = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl:ATLAS_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

const sessionOptions = {
    store,
    secret :process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }

}
store.on("error",()=>{
    console.log("Error on mongo session store",err);
})


// console.log(ATLAS_URL);
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
   await mongoose.connect(ATLAS_URL);
}

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.get("/registerDemo",async (req,res)=>{
    const demoUser = new User({
        email:"demo@gmail.com",
        username:"demo"
    })
    let ans =await User.register(demoUser,"jel");
    res.send(ans);

})
 
app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);




// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the Beach",
//         price:1200,
//         location:" Calangute Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample Was Saved");
//     res.send("Successful testing");

// })

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// })
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not found"));
// });

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "Something went wrong"}  = err;
    // res.render("listings/error.ejs");
    res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("listening to port 8080");
})