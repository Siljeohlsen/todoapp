const protect = require("./auth");
const express = require("express");
const database = require("./database.js");
const router = express.Router();

// ----- Endpoints -----

// Get list ----------------------------
router.get("/list", protect, async function (req, res, next) {
  
  try {
    let data = await database.getAllLists();
    res.status(200).json(data.rows).end();
    
  } catch (err) {
    next(err);
  }
});

// Get Public lists ----------------------------
router.get("/sharelist", protect, async function (req, res, next) {

  try {
    let data = await database.getAllPublicLists();
    res.status(200).json(data.rows).end();
  } catch (err) {
    next(err);
  }
});

// Create lists ----------------------------
router.post("/list", protect, async function (req, res, next) {
  let updata = req.body;
  let userid = res.locals.userid;
  let public = updata.public;


  try {
    let data = await database.createLists(updata.heading, userid, public);

    if (data.rows.length > 0) {
      res.status(200).json({ msg: "The lists were created succesfully" }).end();
    } else {
      throw "The lists couldn't be created";
    }
  } catch (err) {
    next(err);
  }
});

// Update lists ----------------------------
router.put("/list/edit", async (req, res, next) => {
  const updata = req.body;

  try {
    const data = await database.updateList(updata.heading, updata.listid);
    if (data.rows.length > 0) {
      res.status(200).json(data.rows).end();
    } else {
      res.status(404).json({ msg: "Cant find selected list" }).end();
    }
  } catch (err) {
    next(err);
  }
});

// Delete lists ----------------------------
router.delete("/list", protect, async function (req, res, next) {
  let updata = req.body;
  let userid = res.locals.userid;

  try {
    let data = await database.deleteLists(updata.listid, userid);
    if (data.rows.length > 0) {
      res.status(200).json({ msg: "The list was deleted succesfully" }).end();
    } else {
      throw "The list couldn't be deleted";
    }
  } catch (err) {
    next(err);
  }
});


// ----- LIST ITEMS -----

// Get list items ----------------------------
router.get("/listitems", protect, async function (req, res, next) {
  let listitemsid = req.query.listitemsid;

  try {
    let data = await database.getListItems(listitemsid);
    res.status(200).json(data.rows).end();
  } catch (err) {
    next(err);
  }
});

// Create list items ----------------------------
router.post("/listitems", protect, async function (req, res, next) {
  let updata = req.body; // data sendt fra klienten i body-elementet. 
  let listitemsid = updata.listID;

  try {
    let data = await database.createListItems(
      updata.text,
      updata.date,
      listitemsid
    );

    if (data.rows.length > 0) {
      res.status(200).json({ msg: "The lists were created succesfully" }).end();
    } else {
      res.status(400).json({ msg: "kan ikke " }).end();
    }
  } catch (err) {
    next(err);
  }
});

// Delete list items ----------------------------
router.delete("/listitems", protect, async function (req, res, next) {
  let updata = req.body;
  let listid = res.locals.listid;

  try {
    let data = await database.deleteListItems(updata.listitemsid, listid);
    if (data.rows.length > 0) {
      res
        .status(200)
        .json({ msg: "The list item was deleted succesfully" })
        .end();
    } else {
      throw "The list item couldn't be deleted";
    }
  } catch (err) {
    next(err);
  }
});

// Update list items ----------------------------
router.put("/listitems", async (req, res, next) => {
  const updata = req.body;

  try {
    const data = await database.updateListItems(
      updata.text,
      updata.date,
      updata.listitemsid
    );
    if (data.rows.length > 0) {
      res.status(200).json(data.rows).end();
    } else {
      res.status(404).json({ msg: "Cant find selected list" }).end();
    }
  } catch (err) {
    next(err);
  }
});

// ---------------------------
// Exporterer alle funksjonene så de kan brukes i andre moduler (.js-filer)
module.exports = router;
