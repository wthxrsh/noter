const express = require('express')
const app = express();
const path = require('path')
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , "public")));

fs.mkdir(path.join(__dirname, 'files'), function(err){
    if(!err){
        console.log("file created");
    }
})

app.get('/', function(req,res){
    fs.readdir(`./files`, function(err,files){
        res.render("index", {files: files});
    })
})

app.post('/create', function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        res.redirect("/")
    })
})

app.get('/delete', function(req,res){
    var filename = req.query.title;
    console.log(filename);
    fs.unlink(`./files/${filename}`,function(err){
        res.redirect("/")
    })
})

app.get('/file/:filename', function(req,res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8",function(err,filedata){
        res.render('show', {filename: req.params.filename, filedata: filedata});
    })
})
app.listen(8000, function(res, req){
    console.log("server started at 8000")
});