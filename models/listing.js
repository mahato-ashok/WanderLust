const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const Review = require("./review");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage"
        },
        url:{
            type:String,
            default : "https://unsplash.com/photos/a-field-of-sunflowers-with-the-sun-setting-in-the-background-f0tklgtOJCA",
            
        }
        

    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User" //model name
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;