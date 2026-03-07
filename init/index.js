const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderLust";
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
   await mongoose.connect(MONGO_URL);
}
const initDB = async ()=>{
    await Listing.deleteMany({});
    console.log("deletion successful");
    console.log(initData);
    console.log(initData.data)
    initData.data = initData.data.map((obj)=>(
        {...obj,owner:"6995472a1e967fd913afd2b2"}
    ))
    await Listing.insertMany(initData.data);
    console.log("Data is initialized");
}
initDB();