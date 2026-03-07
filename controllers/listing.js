const Listing = require("../models/listing");
const {config,geocoding} = require("@maptiler/client");

config.apiKey = process.env.MAP_API_KEY;

module.exports.index = async (req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner"); //key name
    if(!listing){
        req.flash("error","Listing does not exist !!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.create = async (req,res)=>{
    // let {title,description,price,country,location,image.filename} = req.body;
    //shorthand using object in name field of input
    // let result = listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    const newListing = req.body.listing
    const newList = new Listing(newListing);
    
    try {
    const response = await geocoding.forward(newListing.location, {
      limit: 1
    });
    
     newList.geometry = response.features[0].geometry;
    

    console.log(response.features[0].geometry.coordinates); 
  } catch (err) {
    console.error("Geocode error:", err);
  }


    // console.log(req.user);
    // console.log(newListing);
    //parsing the input we get from user to Listing type
    
    // console.log(req.file);
    // console.log(req.file.url);
    // console.log(req.file.filename);
    newList.image.url = req.file.path;
    newList.image.filename = req.file.filename;
    newList.owner = req.user._id;
   
    console.log(newList);
    let temp = await newList.save();
    console.log(temp);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}


module.exports.edit = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_150,h_150");
    res.render("listings/edit.ejs",{listing,originalUrl});
}

module.exports.update = async (req,res)=>{
    let {id} = req.params;
    let newlist = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    console.log(newlist);
    if(typeof req.file !="undefined" ){
        let url = req.file.path;
        let filename = req.file.filename;
        newlist.image = {url,filename};
        newlist.save();
    }

    req.flash("success","Listing Updated !!");
    res.redirect(`/listings/${id}`);
    
}

module.exports.destroy = async (req,res)=>{
    let {id} = req.params;
   let listing =  await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted !!");
   console.log(listing);
   res.redirect("/listings");
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}