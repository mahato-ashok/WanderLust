const express = require("express");
// const users = require("./Routes/user");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretcode"));
const sessionoptions ={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
}
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(session(sessionoptions
))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success= req.flash("Success");
    res.locals.error = req.flash("Error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    if(name === "anonymous"){
        req.flash("Error","Please provide a name");
    }
    else {
        req.flash("Success","New user registeres");

    }

    req.session.name = name;
    res.redirect("/hello");
    console.log(req.session.name);
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name });
})


// app.get("/test",(req,res)=>{
//     if(req.session.count) req.session.count++;
//     else req.session.count =1;
//     res.send(`You sent a request ${req.session.count} times`);
// })

// app.use("/users",users);
// app.get("/signed",(req,res)=>{
//     res.cookie("name","ashok",{signed:true});
//     res.send("done!!")
// })
// app.get("/verify",(req,res)=>{
//     res.send(req.signedCookies);
// })
// app.get("/getCookies",(req,res)=>{
//     res.cookie("name","Ashok");
//     res.cookie("age","20");
//     res.send("Sent you a cookie");
// })
// app.get("/printCookies",(req,res)=>{
//     let {name="alok"} = req.cookies;
//     res.send(`Hello${name}`);
// })
app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
})