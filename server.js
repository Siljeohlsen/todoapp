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
	let sql = "SELECT * FROM todoapp";
	try{
		let result = await pool.query(sql);
		res.status(200).json(result.rows).end();
	}
	catch(err) {
		res.status(500).json({error: err}).end();
	}
});

server.post("/todoapp", async function(req, res, next) {

	let updata = req.body;
	let userid = 1;

	let sql = 'INSERT INTO todoapp (id, date, heading, listtext, userid) VALUES(DEFAULT, DEFAULT, $1, $2, $3) returning *';
	let values = [updata.heading, updata.listtext, userid];

	try{
		let result = await pool.query(sql, values);

		if (result.rows.length > 0) {
			res.status(200).json({msg: "The lists were created succesfully"}).end();
		}
		else{
			throw "The lists couldn't be created";
		}
	}
	catch(err) {
		res.status(500).json({error: err}).end();
	}
});

server.delete("/", function(req, res, next) {
	res.status(200).send("Hello from DELETE").end();
});


// start server ------------------------
server.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});
