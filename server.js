const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

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
