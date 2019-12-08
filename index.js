const fs = require('fs');
const express = require('express');
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Create db if not exists
const dir = './db';
const db = './db/db.json';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
if (!fs.existsSync(db)) fs.writeFileSync(db, '[]', { encoding: 'utf-8' });


// API Routes


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



// HTML Routes

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
