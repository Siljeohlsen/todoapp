const crypto = require("crypto");
const secret = process.env.secret;  // her brukes environment variable for å skjule "hemmeligheten", denne ble opprettet på herouk inne
//på appen vår. 
let utils = {};

//Decode Credentials -----------------------------------------
// Funksjon for å dekode credential-stringen som er laget på klienten.
//
utils.decodeCred = function (credString) {
  let cred = {};

  //remove the word 'basic'
  let b64String = credString.replace("basic ", "");

  //convert to ascii text (clear text)
  let asciiString = Buffer.from(b64String, "base64").toString("ascii");

  //extract the username - using regex
  cred.username = asciiString.replace(/:.*/, "");

  //extract the password
  cred.password = asciiString.replace(cred.username + ":", "");

  return cred;
};

//Create Hash -----------------------------------------
// Her laged en "hash" ut av passordet. Det er nærmest umulig å ekstrahere passordet ut fra hash-en. 
// En hash er en satt lengde med sifre. Og vi får igjen den samme stringen med sifre om vi setter inn det samme passordet igjen. 
// Det er hashen som lagres i databasen, ikke passordet. 
// Når brukeren logger inn lages det en hash ut ifra passordet. Om dette stemmer overens med hashen som ligger i databasen blir brukeren 
// "godkjent", hvis ikke så får man beskjed om at det er feil passord. 

// Viktig at både hashen og salten lagres i databasen så det er mulig å verifisere passordet når brukeren logger inn. 
utils.createHash = function (password) {
  let hash = {};

  hash.salt = Math.random().toString(); // Genererer et tilfeldig tall å legge til i hashsen, for å "salte" det. 
  hash.value = crypto.scryptSync(password, hash.salt, 64).toString("hex");

  return hash;
};

// Create Token -----------------------------------------
// Lager token for login, vi bruker en standard som heter "JSON web token (JWT)". 


// Token er en text-string som består av tre deler: 
// Part1 / HEADER: JSON som inneholder informasjon om hashing-algoritmen som brukes til å generere signaturen. 
// Part 2 / PAYLOAD: JSON som inneholder informasjon (claims), som brukernavn, brukerID, og når token ble laget. 
// Part 3 / SIGNATURE: Header og payload blir begge kodet inn i base64 også kombinert med et punktum mellom. Den blir så hashet med
// krypteringsalgoritmen som blir funnet i headeren. Den resulterende hashen blir så lagt til som den tredje delen av stringen etter et
// punktum. 

// Token blir så lagret på klienten (typisk i local storage, dette gjør vi og), også sent til serveren med autoriserings-headeren:
// "authorization": token 


utils.createToken = function (username, userID) {
  // part 1 and 2 as JSON-text
  let part1 = JSON.stringify({ alg: "HS256", typ: "JWT" });
  let part2 = JSON.stringify({
    user: username,
    userid: userID,
    iat: Date.now(),
  });

  // part 1 and 2 as base64
  let b64Part1 = Buffer.from(part1).toString("base64");
  let b64Part2 = Buffer.from(part2).toString("base64");

  // combine part 1 and 2 separated with . (period)
  let openPart = b64Part1 + "." + b64Part2;

  // create the 3. part (signature) using a hash-function in the crypto-module

  let sign = crypto
    .createHmac("SHA256", secret)
    .update(openPart)
    .digest("base64");

  return openPart + "." + sign;
};

// Verify Token -----------------------------------------
// Når serveren tar i mot en token fra klienten, blir den verifisert ved å hashe header/payload (part1 & part2), også sjekker om resultatet
// er det samme som signaturen. Om tokenen har en utløpsdato blir dette også sjekket her med Issued At Time-informasjonen "iat".

// Vi kommer til å få forskjellige resultat når dette testes ettersom "iat"'en/ Issued At Time'en er forskjellig hver gang.

utils.verifyToken = function (token) {
  //using the string-method split to extract the three parts into an array
  let tokenArr = token.split(".");
  let openPart = tokenArr[0] + "." + tokenArr[1];
  let signToCheck = tokenArr[2];

  let sign = crypto
    .createHmac("SHA256", secret)
    .update(openPart)
    .digest("base64");

  if (signToCheck != sign) {
    //signature not ok
    return false;
  }

  let payloadTxt = Buffer.from(tokenArr[1], "base64").toString("ascii");
  let payload = JSON.parse(payloadTxt);

  let expireTime = payload.iat + 24 * 60 * 60 * 1000; //time in millisec.
  if (expireTime < Date.now()) {
    //the token has expired
    return false;
  }

  //token ok
  return payload;
};

// Verify Password -----------------------------------------
utils.verifyPassword = function (pswFromUser, hashFromDB, saltFromDB) {
  hash = crypto.scryptSync(pswFromUser, saltFromDB, 64).toString("hex");

  if (hash == hashFromDB) {
    return true;
  }

  return false;
};

//-----------------------------------------
module.exports = utils;
