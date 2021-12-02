const protect = require('./auth');
const express = require('express');
const database = require('./database.js');
const authUtils = require("./auth_utils.js");
const router = express.Router();

// endpoints -----------------------------

// User login ---------------------------
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

// Create new user -----------------------
router.post("/users", async function(req, res, next){
    
    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == "" || cred.password == ""){
        res.status(401).json({msg: "No username or password"}).end();
        return;
    }

    let hash = authUtils.createHash(cred.password);

    try {
        let data = await database.createUser(cred.username, hash.value, hash.salt);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "The user was created succesfully"}).end();
        }
        
    }
    catch(err) {
        if(err.constraint === "username_unique"){
            res.status(400).json({msg: "Username already taken"}).end();
        }else{
            res.status(403).json({msg: "Wrong username or password"}).end(); 
        }
        next(err);
    }
  
});

// Delete user -----------------------
router.delete("/users/delete", protect, async function(req, res, next){
    

   let userid = res.locals.userid;

    try {
       let data = await database.deleteUser(userid); 

        if (data.rows.length > 0) {
            res.status(200).json({msg: "The user was deleted succesfully"}).end();
        }else if(data.rows.length = 0){
            res.status(404).json({msg: "No data, login to delete user"}).end();
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