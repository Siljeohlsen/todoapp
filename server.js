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
server.get("/", function(req, res, next) {
	res.status(200).send("Hello from GET").end();
});

server.post("/", function(req, res, next) {	
	console.log(req.body.country);
	res.status(200).send("Hello from POST").end();
});

server.delete("/", function(req, res, next) {
	res.status(200).send("Hello from DELETE").end();
});


// start server ------------------------
server.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});
