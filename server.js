const database = require('./modules/database.js');
const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

const pg = require('pg');
const tdaURI = "postgres://vdoxbxjaqxnsno:999f2f2993e7b8b9a34de8602571741c122cd539e136ad5d981b6a773b86dd5a@ec2-52-214-178-113.eu-west-1.compute.amazonaws.com:5432/ddghcl0kmg4ejf";
const connstring = process.env.DATABASE_URL || tdaURI;
const pool = new pg.Pool({
	connectionString: connstring,
	ssl: { rejectUnauthorized: false }
});


// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());

// endpoints ----------------------------
server.get("/todoapp", async function(req, res, next) {
	
	try{
		let data = await database.getAllLists();
		res.status(200).json(data.rows).end();
	}
	catch(err) {
		next(err);
	}
});

server.post("/todoapp", async function(req, res, next) {

	let updata = req.body;
	let userid = 1;

	try{
		let data = await database.createLists(updata.heading, updata.listtext, userid);

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

server.delete("/todoapp", async function(req, res, next) {

	let updata = req.body;

	try{
		let data = await database.deleteLists(updata.id);
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

//error handling
server.use(function (err, req, res, next) {
	res.status(500).json({
		error: 'Something went wrong on the server!',
		descr: err
	}).end();

});

// start server ------------------------
server.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});
