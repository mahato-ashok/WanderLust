const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingControllers = require("../controllers/listing.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const {storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })


router.route("/")
// INDEX ROUTE
.get( wrapAsync(listingControllers.index))
.post(
    isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync (listingControllers.create)
    
);

// NEW LISTING
// it is necessary to create the new route before the get route by id because the new will be treated as  parameter(id) if created after it!!
router.get("/new",isLoggedIn,listingControllers.renderNewForm);


router.route("/:id")
// SHOW ROUTE
.get( wrapAsync(listingControllers.show))


.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingControllers.update))


.delete(isLoggedIn,isOwner ,wrapAsync(listingControllers.destroy));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.edit));

module.exports = router;