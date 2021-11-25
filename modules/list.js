const express = require('express');
const protect = require('./auth.js');
const db = require ('./db.js');
const router = express.Router();

// endpoints ----------------------------
router.get("/list", protect, async function(req, res, next) {
	
	console.log(res.locals.username);
	console.log(res.locals.userid);

	try{
		let data = await db.getAllBlogPosts();
		res.status(200).json(data.rows).end();
	}
	catch(err) {

		next(err);
	}
});

router.post("/list", protect, async function(req, res, next) {	
	
	let updata = req.body;
	let userid = res.locals.userid; 

	try {
		let data = await db.createBlogPost(updata.heading, updata.blogtext, userid);

		if ( data.rows.length > 0){
			res.status(200).json({msg: "The list was created succefully"}).end();
		} 
		else{
			throw "The list couldn't be created";
		}
	}
	catch(err){
		next(err);
	}
});

router.delete("/list", protect, async function(req, res, next) {
	
	let updata = req.body;
	let userid = res.locals.userid;

	try {
		let  data = await db.deleteBlogPost(updata.id, userid);

		if (data.rows.length > 0) {
			res.status(200).json({msg : "The blogpost was deleted succesfully"}).end();
		}
		else {
			throw "The blogpost couldn't be deleted";
		}
	}
	catch(err) {
		next(err);
	}
});

module.exports = router;
