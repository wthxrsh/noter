const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Setting view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Explicitly setting views directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serving static files

// Ensure 'files' directory exists
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
    console.log("'files' directory created");
}

// Route: Home Page
app.get('/', function (req, res) {
    fs.readdir(filesDir, function (err, files) {
        if (err) {
            console.error("Error reading files directory:", err);
            return res.status(500).send("Error reading files directory");
        }
        res.render("index", { files: files });
    });
});

// Route: Create a File
app.post('/create', function (req, res) {
    const fileName = req.body.title.split(' ').join('');
    const filePath = path.join(filesDir, `${fileName}.txt`);
    fs.writeFile(filePath, req.body.details, function (err) {
        if (err) {
            console.error("Error creating file:", err);
            return res.status(500).send("Error creating file");
        }
        res.redirect("/");
    });
});

// Route: Delete a File
app.get('/delete', function (req, res) {
    const fileName = req.query.title;
    if (!fileName) {
        return res.status(400).send("Error: 'title' query parameter is required");
    }
    const filePath = path.join(filesDir, fileName);
    fs.unlink(filePath, function (err) {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).send("Error deleting file");
        }
        res.redirect("/");
    });
});

// Route: Display File Content
app.get('/file/:filename', function (req, res) {
    const filePath = path.join(filesDir, req.params.filename);
    fs.readFile(filePath, "utf-8", function (err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

// Exporting the app (for Vercel serverless function)
module.exports = app;
