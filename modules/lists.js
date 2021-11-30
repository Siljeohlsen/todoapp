const protect = require('./auth');
const express = require('express');
const database = require ('./database.js');
const router = express.Router();

// endpoints ----------------------------
router.get("/todoapp", protect, async function(req, res, next) {
	
	console.log(res.locals.username);
	console.log(res.locals.userid);

	try{
		let data = await database.getAllLists();
		res.status(200).json(data.rows).end();
	}
	catch(err) {
		next(err);
	}
});

router.post("/todoapp",  protect,  async function(req, res, next) {

	let updata = req.body;
	let userid = res.locals.userid;

	try{
		let data = await database.createLists(updata.heading, userid);

		if (data.rows.length > 0) {
			res.status(200).json({msg: "The lists were created succesfully"}).end();
		}
		else{
			throw "The lists couldn't be created";
		}
	}
	catch(err) {
		next(err);
	}
});

router.delete("/todoapp", protect, async function(req, res, next) {

	let updata = req.body;
	let userid = res.locals.userid;

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

//------ Listitems Aner ikke om dette funker

router.get("/listitems", /*protect*/ async function(req, res, next) {
	
	console.log(res.locals.text);
	console.log(res.locals.listid);

	try{
		let data = await database.getListItems();
		res.status(200).json(data.rows).end();
	}
	catch(err) {
		next(err);
	}
});

router.post("/todoapp/listitems",  protect, async function(req, res, next) {

	let updata = req.body;
	let listid = res.locals.listid;

	try{
		let data = await database.createListItems(updata.text, listid);

		if (data.rows.length > 0) {
			res.status(200).json({msg: "The lists were created succesfully"}).end();
		}
		else{
			throw "The lists couldn't be created";
		}
	}
	catch(err) {
		next(err);
	}
});

/*

router.delete("/listitems", protect, async function(req, res, next) {

	let updata = req.body;
	let listid = res.locals.listid;

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
module.exports = router;