const express = require('express');
const db = require('./db.js');
const authUtils = require("./auth_utils.js");
const router = express.Router();

// endpoints -----------------------------

// user login ---------------------------
router.post("/users/login", async function(req, res, next) {
    res.status(200).send("Hello from POST - /users/login").end();
});

// list all users -----------------------
router.get("/users", async function(req, res, next){

    try {
        let data = await db.getAllUsers();
        res.status(200).json(data.rows).end();
    }
    catch(err) {
        next(err);
    }
});

// create new user -----------------------
router.post("/users", async function(req, res, next){

    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == "" || cred.password == ""){
        res.status(401).json({error: "No username or password"}).end();
        return;
    }

    let hash = authUtils.createHash(cred.password);

    try {
        let data = await db.createUser(cred.username, hash.value, hash.salt);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "The user was created succesfully"}).end();
        }
        else{
            throw "The user couldnt be created";
        }
    }
    catch(err) {
        next(err);
    }
});

// delete a user -----------------------
router.delete("/users", async function(req, res, next){
    res.status(200).send("Hello from DELETE - /users").end();
});

// -------------------------------------
module.exports = router; 