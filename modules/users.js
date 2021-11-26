const express = require('express');
const database = require('./database.js');
const authUtils = require("./auth_utils.js");
const router = express.Router();

// endpoints -----------------------------

// user login ---------------------------
router.post("/users/login", async function(req, res, next) {
   
});

// list all users -----------------------
router.get("/users", async function(req, res, next){

    res.status(200).send("Hello from GET - /users").end();
   
});

// create new user -----------------------
router.post("/users", async function(req, res, next){
    
      
});

// delete a user -----------------------
router.delete("/users", async function(req, res, next){
    res.status(200).send("Hello from DELETE - /users").end();
});

// -------------------------------------
module.exports = router; 