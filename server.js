const database = require('./modules/database.js');
const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

const lists = require("./modules/lists.js");
const users = require("./modules/users.js");

// Middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());

server.use(lists);
server.use(users);

//Error handling
server.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).json({
		error: 'Something went wrong on the server!',
		descr: err
	}).end();
});

// Start server ------------------------
server.listen(server.get("port"), function () {
	console.log("server running");
});
