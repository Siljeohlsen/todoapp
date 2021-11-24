const express = require('express');
const db = require ('./db.js');
const router = express.Router();

// endpoints ----------------------------
router.get("/blogposts", async function(req, res, next) {
	
	try{
		let data = await db.getAllBlogPosts();
		res.status(200).json(data.rows).end();
	}
	catch(err) {
		console.error(err);
		next(err);
	}
});

router.post("/blogposts", async function(req, res, next) {	
	
	let updata = req.body;
	let userid = 1; // must be changed when implementing users

	try {
		let data = await db.createBlogPost(updata.heading, updata.blogtext, userid);

		if ( data.rows.length > 0){
			res.status(200).json({msg: "The todolist was created succefully"}).end();
		} 
		else{
			throw "The todolist couldn't be created";
		}
	}
	catch(err){
		next(err);
	}
});

router.delete("/blogposts", async function(req, res, next) {
	
	let updata = req.body;

	try {
		let  data = await db.deleteBlogPost(updata.id);

		if (data.rows.length > 0) {
			res.status(200).json({msg : "The todolist was deleted succesfully"}).end();
		}
		else {
			throw "The todolist couldn't be deleted";
		}
	}
	catch(err) {
		next(err);
	}
});

module.exports = router;