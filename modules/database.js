const pg = require('pg');
const tdaURI = "postgres://vdoxbxjaqxnsno:999f2f2993e7b8b9a34de8602571741c122cd539e136ad5d981b6a773b86dd5a@ec2-52-214-178-113.eu-west-1.compute.amazonaws.com:5432/ddghcl0kmg4ejf";
const connstring = process.env.DATABASE_URL || tdaURI;
const pool = new pg.Pool({
	connectionString: connstring,
	ssl: { rejectUnauthorized: false }
});

// database methods ---------------------------
let databaseMethods = {}; //create empty object

// ----------------------------
databaseMethods.getAllLists = function() {
    let sql = "SELECT * FROM list";
    return pool.query(sql); //return the promise
}

// Create lists ----------------------------
databaseMethods.createLists = function(heading, userid) {
    let sql = "INSERT INTO list (heading, userid) VALUES($1, $2) returning *";
    let values = [heading, userid];
    return pool.query(sql, values); //return the promise
}

// Delete lists ----------------------------
databaseMethods.deleteLists = function(listid, userid) {
    let sql = "DELETE FROM list WHERE listid = $1 AND userid = $2 RETURNING *";
    let values = [listid, userid];
    return pool.query(sql, values); //return the promise
}

// ----- List Items ----- DETTE ER RIKTIG

databaseMethods.getListItems = function(listitemsid){
    let sql = "SELECT * FROM listitems WHERE listitemsid = $1"; 
    let values = [listitemsid];
    return pool.query(sql); //return the promise
}

databaseMethods.createListItems = function(text){
    let sql = "INSERT INTO listitems (text) VALUES(DEFAULT, $1) returning*";
    values = [text];
    return pool.query(sql, values);
}

// Users -----------------------

databaseMethods.getAllUsers = function(){
    let sql = "SELECT listid, username FROM users";
    return pool.query(sql); //return the promise
}

// Get user -------------------------------
databaseMethods.getUser = function(username) {
    let sql = "SELECT * FROM users WHERE username = $1";
    let values = [username];
    return pool.query(sql,values); //return the promise
}

// Create user -------------------------------
databaseMethods.createUser = function(username, password, salt){
    let sql = "INSERT INTO users (listid, username, password, salt) VALUES(DEFAULT, $1, $2, $3) returning *";
    let values = [username, password, salt];
    return pool.query(sql, values); //return the promise
}

// Delete user ------------------------------- skal det være userID??? 
databaseMethods.deleteUser = function(id) {
    let sql = "DELETE FROM users WHERE id = $1 RETURNING *";
    let values = [id];
    return pool.query(sql, values); //return the promise 
}


// export databaseMethods ----------------------------
module.exports = databaseMethods;


