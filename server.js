const database = require('./modules/database.js');
const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

const lists = require("./modules/lists.js");
const users = require("./modules/users.js");

/*
const authUtils = require("./modules/auth_utils.js");

let hash = authUtils.createHash("Olsen");
console.log(hash);

let token = authUtils.createToken("Silje", 1);
console.log(token);

let payload = authUtils.verifyToken(token);
console.log(payload);
*/



// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());

server.use(lists);
server.use(users);

//error handling
server.use(function (err, req, res, next) {
	res.status(500).json({
		error: 'Something went wrong on the server!',
		descr: err
	}).end();
});

// start server ------------------------
server.listen(server.get("port"), function () {
	console.log("server running");
});
