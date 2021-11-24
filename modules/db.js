// setup connection ------
const pg = require('pg');
const dbURI = "postgres://lmiovlvxlynfvs:e582008387eb4f4bd59d7ae59b5c5a7ad2a038a3a5df280dad8f7ee7b0dcd236@ec2-52-208-185-143.eu-west-1.compute.amazonaws.com:5432/dfqm5bv1b1ks81";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
    connectionString: connstring,
    ssl: { rejectUnauthorized: false}
});

// database methods --------
let dbMethods = {}; //create empty object

// -------------------------
dbMethods.getAllBlogPosts = function() {
    let sql = "SELECT * FROM blogposts";
    return pool.query(sql); //return the promise
}

// -------------------------
dbMethods.createBlogPost = function(heading, blogtext, userid) {
    let sql = "INSERT INTO blogposts (id, date, heading, blogtext, userid) VALUES(DEFAULT, DEFAULT, $1, $2, $3) returning *";
    let values = [heading, blogtext, userid];
    return pool.query(sql, values); //return the promise
}

// -------------------------
dbMethods.deleteBlogPost = function(id) {
    let sql = "DELETE FROM blogposts WHERE id = $1 RETURNING *";
    let values = [id];
    return pool.query(sql, values); //return the promise
}

// export dbMethods --------
module.exports = dbMethods;
