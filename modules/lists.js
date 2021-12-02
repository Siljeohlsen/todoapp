const protect = require('./auth');
const express = require('express');
const database = require ('./database.js');
const router = express.Router();

// endpoints ----------------------------
router.get("/list", protect, async function(req, res, next) {
	
	console.log(res.locals.username);
	console.log(res.locals.userid);
	console.log(res.locals.listid);

	try{
		let data = await database.getAllLists();
		res.status(200).json(data.rows).end();
	}
	catch(err) {
		next(err);
	}
});

router.get("/sharelist", protect, async function(req, res, next) {
	
	console.log(res.locals.username);
	console.log(res.locals.userid);
	console.log(res.locals.listid);

	try{
		let data = await database.getAllPublicLists();
		res.status(200).json(data.rows).end();
	}
	catch(err) {
		next(err);
	}
});

router.post("/list",  protect, async function(req, res, next) {

	let updata = req.body;
	let userid = res.locals.userid;
	let public = updata.public;
	console.log(res.locals.listid);

	try{
		let data = await database.createLists(updata.heading, userid , public);

		if (data.rows.length > 0) {
			res.status(200).json({msg: "The lists were created succesfully"}).end();
		}
		else{
			throw "The lists couldn't be created";
		}
	}
	catch(err) {
		console.log(err)
		next(err);
	}
});

router.put("/list/edit", async (req, res, next) => {

    const updata = req.body;

    try{
        const data = await database.updateList(updata.heading, updata.listid);
        if(data.rows.length > 0){
            res.status(200).json(data.rows).end();
        }
        else{
            res.status(404).json({msg: "Cant find selected list"}).end();
        }
    }
    catch(err){
        
		next(err);
		
    }
});

router.delete("/list", protect, async function(req, res, next) {

	let updata = req.body;
	let userid = res.locals.userid;

	try{
		console.log("User id ", userid);
		console.log(updata);
		let data = await database.deleteLists(updata.listid, userid);
		if (data.rows.length > 0) {
			res.status(200).json({msg: "The list was deleted succesfully"}).end();
		}
		else{
			console.log(data);
			throw "The list couldn't be deleted";
		}
	}
	catch(err) {
		console.log(err);
		next(err);
	}
});

//------ Listitems

router.get("/listitems", protect, async function(req, res, next) {
	
	let listitemsid = req.query.listitemsid;

	try{
		let data = await database.getListItems(listitemsid)
		res.status(200).json(data.rows).end();
	}
	catch(err) {
		next(err);
	}
});

router.post("/listitems",  protect, async function(req, res, next) {

	let updata = req.body;
	let listitemsid = updata.listID;

	try{
		let data = await database.createListItems(updata.text, updata.date, listitemsid);

		if (data.rows.length > 0) {
			res.status(200).json({msg: "The lists were created succesfully"}).end();
		}
		else{
			res.status(400).json({msg: "kan ikke "}).end();
		}
	}
	catch(err) {
		next(err);
	}
});

/*

router.delete("/listitems", protect, async function(req, res, next) {

	let updata = req.body;
	let listitemsid = res.locals.listitemsid;

	try{
		let data = await database.deleteLists(updata.id, userid);
		if (data.rows.length > 0) {
			res.status(200).json({msg: "The list was deleted succesfully"}).end();
		}
		else{
			throw "The list couldn't be deleted";
		}
	}
	catch(err) {
		next(err);
	}
});
*/ 

router.put("/listitems", async (req, res, next) => {

    const updata = req.body;

    try{
        const data = await database.updateListItems(updata.text, updata.date, updata.listitemsid);
        if(data.rows.length > 0){
            res.status(200).json(data.rows).end();
        }
        else{
            res.status(404).json({msg: "Cant find selected list"}).end();
        }
    }
    catch(err){
        
		next(err);
		
    }
});

module.exports = router;