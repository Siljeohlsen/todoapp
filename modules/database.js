const pg = require('pg');
const tdaURI = "postgres://flalmtnwfbbbbb:de7cc447a76ac3df6befa56cfb98f558c13473b7c352234cdc4bb42212fe8a5e@ec2-54-195-246-55.eu-west-1.compute.amazonaws.com:5432/d7bccibc5r5hti";
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

databaseMethods.getAllPublicLists = function() {
    let sql = "SELECT * FROM list WHERE public = 1";
    return pool.query(sql); //return the promise
}

// Create lists ----------------------------
databaseMethods.createLists = function(heading, userid , public) {
    let sql = "INSERT INTO list (heading, userid, public) VALUES($1, $2, $3) returning *";
    let values = [heading, userid, public];
    return pool.query(sql, values); //return the promise
}

// Delete lists ----------------------------
databaseMethods.deleteLists = function(listid, userid) {
    let sql = "DELETE FROM list WHERE listid = $1 AND userid = $2 RETURNING *";
    let values = [listid, userid];
    return pool.query(sql, values); //return the promise
}

// ----- List Items ----- DETTE ER RIKTIG

databaseMethods.getListItems = function(listid){
    let sql = "SELECT * FROM listitems WHERE listid = $1"; 
    let values = [listid];
    return pool.query(sql, values); //return the promise
}

databaseMethods.createListItems = function(text, date, listid){
    let sql = "INSERT INTO listitems (listitemsid, text, date, listid) VALUES(DEFAULT, $1, $2, $3) returning*";
    values = [text, date, listid];
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
    let sql = "INSERT INTO users (id, username, password, salt) VALUES(DEFAULT, $1, $2, $3) returning *";
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


