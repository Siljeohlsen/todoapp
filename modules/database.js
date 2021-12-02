const pg = require("pg");
const tdaURI =
  "postgres://flalmtnwfbbbbb:de7cc447a76ac3df6befa56cfb98f558c13473b7c352234cdc4bb42212fe8a5e@ec2-54-195-246-55.eu-west-1.compute.amazonaws.com:5432/d7bccibc5r5hti";
const connstring = process.env.DATABASE_URL || tdaURI; //absolutt siste steg å fjerne denne + den over
const pool = new pg.Pool({
  connectionString: connstring,
  ssl: { rejectUnauthorized: false },
});

// Database methods ---------------------------
let databaseMethods = {}; //create empty object

// ----- LISTS -----

// Get lists ----------------------------
databaseMethods.getAllLists = function () {
  let sql = "SELECT * FROM list WHERE public = 0";
  return pool.query(sql); //return the promise
};
// Get public lists ----------------------------
databaseMethods.getAllPublicLists = function () {
  let sql = "SELECT * FROM list WHERE public = 1";
  return pool.query(sql); //return the promise
};

// Create lists ----------------------------
databaseMethods.createLists = function (heading, userid, public) {
  let sql =
    "INSERT INTO list (heading, userid, public) VALUES($1, $2, $3) returning *";
  let values = [heading, userid, public];
  return pool.query(sql, values); //return the promise
};

// Update list ----------------------------
databaseMethods.updateList = function (heading, listid) {
  const sql = "UPDATE list SET heading = $1 WHERE listid = $2 RETURNING *";
  const values = [heading, listid];
  return pool.query(sql, values);
};

// Delete lists ----------------------------
databaseMethods.deleteLists = function (listid, userid) {
  let sql = "DELETE FROM list WHERE listid = $1 AND userid = $2 RETURNING *";
  let values = [listid, userid];
  return pool.query(sql, values); //return the promise
};

// ----- LIST ITEMS -----

// Get list items ----------------------------
databaseMethods.getListItems = function (listid) {
  let sql = "SELECT * FROM listitems WHERE listid = $1";
  let values = [listid];
  return pool.query(sql, values); //return the promise
};

// Create list items ----------------------------
databaseMethods.createListItems = function (text, date, listid) {
  let sql =
    "INSERT INTO listitems (listitemsid, text, date, listid) VALUES(DEFAULT, $1, $2, $3) returning*";
  values = [text, date, listid];
  return pool.query(sql, values);
};
// Delete list items ----------------------------
databaseMethods.deleteListItems = function (listitemsid, listid) {
  let sql =
    "DELETE FROM listitems WHERE listitemsid = $1 AND listid = $2 RETURNING *";
  let values = [listitemsid, listid];
  return pool.query(sql, values); //return the promise
};
// Update list items ----------------------------
databaseMethods.updateListItems = function (text, date, listitemsid) {
  const sql =
    "UPDATE listitems SET text = $1, date = $2 WHERE listitemsid = $3 RETURNING *";
  const values = [text, date, listitemsid];
  return pool.query(sql, values);
};

// ----- USERS -----

// Get all users -------------------------------
databaseMethods.getAllUsers = function () {
  let sql = "SELECT listid, username FROM users";
  return pool.query(sql); //return the promise
};

// Get user -------------------------------
databaseMethods.getUser = function (username) {
  let sql = "SELECT * FROM users WHERE username = $1";
  let values = [username];
  return pool.query(sql, values); //return the promise
};

// Create user -------------------------------
databaseMethods.createUser = function (username, password, salt) {
  let sql =
    "INSERT INTO users (id, username, password, salt) VALUES(DEFAULT, $1, $2, $3) returning *";
  let values = [username, password, salt];
  return pool.query(sql, values); //return the promise
};

// Delete user -------------------------------
databaseMethods.deleteUser = function (id) {
  let sql = "DELETE FROM users WHERE id = $1 RETURNING *";
  let values = [id];
  return pool.query(sql, values); //return the promise
};

// Export database methods ----------------------------
module.exports = databaseMethods;
