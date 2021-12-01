const express = require('express');
const database = require('./database.js');
const authUtils = require("./auth_utils.js");
const router = express.Router();

// endpoints -----------------------------

// user login ---------------------------
router.post("/users/login", async function(req, res, next) {
    
    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == "" || cred.password == ""){
        res.status(401).json({error: "no username og password"}).end();
        return;
    }

    try {
        let data = await database.getUser(cred.username);

        if (data.rows.length > 0) {
            let userid = data.rows[0].id;
            let username = data.rows[0].username;
            let userhashpassword = data.rows[0].password;
            let usersalt = data.rows[0].salt;

            if (authUtils.verifyPassword(cred.password, userhashpassword, usersalt)){

                let tok = authUtils.createToken(username, userid);
                res.status(200).json({
                    msg: "The login was succesful.",
                    token: tok
                }).end();

            }else{
                res.status(401).json({msg: "Invalid password"}).end();
                return;
             }
        }else {
            res.status(403).end();
            return;
        }
    }
    catch (err) {
        next(err);
    }
    
});

// list all users -----------------------
router.get("/users", async function(req, res, next){

    res.status(200).send("Hello from GET - /users").end();
    /*
    try {
        let data = await database.getAllUsers();
        res.status(200).json(data.rows).end();
    }
    catch(err) {
        next(err);
    }
    */
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
        let data = await database.createUser(cred.username, hash.value, hash.salt);

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
    
    let url 
    let updata = req.body; viktig

    try {
       let data = await database.deleteUser(id); // riktig parametere = Users/ id,passord, salt

        if (data.rows.length > 0) {
            res.status(200).json({msg: "The user was deleted succesfully"}).end();
        }
        else{
            throw "The user couldnt be deleted";
        }
    }
    catch(err) {
        next(err);
    }
});

// -------------------------------------
module.exports = router; 