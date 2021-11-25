const express = require("express");
const { createToken } = require("./Modules/auth_utils.js");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

const list = require("./Modules/list.js");
const users = require("./Modules/users.js");


// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());


server.use(list);
server.use(users);


// general error handling ------
server.use(function (err,req, res, next){
	
	console.error(err);
	
	res.status(500).json({
		error: 'Something went wrong on the server!',
		descr: err
	}).end();
});

// start server ------------------------
server.listen(server.get("port"), function () {
	console.log("Server running");
});



