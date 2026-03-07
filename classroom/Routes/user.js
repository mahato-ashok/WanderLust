const express = require("express");
const  router = express.Router();

// user routes
router.get("/",(req,res)=>{
    res.send("GET route for /");
})
router.post("/",(req,res)=>{
    res.send("POST route for users");
})
router.get("/:id",(req,res)=>{
    res.send(req.params);
})
router.delete("/:id",(req,res)=>{
    res.send("DELETE route for users");
})
module.exports = router;
