const fs = require('fs');
//const util = require('util');
const express = require('express');
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

//const readFileAsync = util.promisify(fs.readFile);
//const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// API Calls

const db = './db/db.json';

app.get("/api/notes", function(req, res) {
    fs.readFile(db, 'utf-8', function(err, data) {
        let notes = JSON.parse(data);
        res.json(notes);
    });
});
app.post("/api/notes", function(req, res) {
    fs.readFile(db, 'utf-8', function(err, data) {
        let notes = JSON.parse(data);
        let newId = req.body.id;
        notes.push(req.body);
        fs.writeFile(db, JSON.stringify(notes, null, 4), 'utf-8', function(err) {
            if (err) throw err;
            res.json(req.body);
            console.log(`Note ${newId} added.`);
        });
    });
});
app.delete("/api/notes/:id", function(req, res) {
    fs.readFile(db, 'utf-8', function(err, data) {
        let notes = JSON.parse(data);
        let delId = req.params.id;
        let delIndex = notes.findIndex(e => e.id == delId);
        // let delNote = notes[delIndex];
        notes.splice(delIndex, 1);
        fs.writeFile(db, JSON.stringify(notes, null, 4), 'utf-8', function(err) {
            if (err) throw err;
            res.json(`Note ${delId} deleted.`);
            console.log(`Note ${delId} deleted.`);
        });
    });
});



// Routes

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});



// Listen on port

app.listen(port, function() {
    console.log(`App listening on port ${port}.`);
});
