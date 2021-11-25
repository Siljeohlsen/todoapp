const pg = require('pg');
const tdaURI = "postgres://vdoxbxjaqxnsno:999f2f2993e7b8b9a34de8602571741c122cd539e136ad5d981b6a773b86dd5a@ec2-52-214-178-113.eu-west-1.compute.amazonaws.com:5432/ddghcl0kmg4ejf";
const connstring = process.env.DATABASE_URL || tdaURI;
const pool = new pg.Pool({
	connectionString: connstring,
	ssl: { rejectUnauthorized: false }
});

// database methods ---------------------------
let dbMethods = {}; //create empty object

// ----------------------------
dbMethods.getAllLists = function() {
    let sql = "SELECT * FROM todoapp";
    return pool.query(sql); //return the promise
}

// ----------------------------
dbMethods.createLists = function(heading, blogtext, userid) {
    let sql = "INSERT INTO todoapp (id, date, heading, listtext, userid) VALUES(DEFAULT, DEFAULT, $1, $2, $3) returning*";
    let values = [heading, listtext, userid];
    return pool.query(sql, values); //return the promise
}

// ----------------------------
dbMethods.deleteLists = function(id) {
    let sql = "DELETE FROM todoapp WHERE id = $1 RETURNING*";
    let values = [id];
    return pool.query(sql, values); //return the promise
}

// export dbMethods ----------------------------
module.exports = dbMethods;


