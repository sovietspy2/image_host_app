const express = require("express");
const fs = require("fs");
const app = express();
const basicAuth = require("express-basic-auth");
require('dotenv').config()
const fileUpload = require('express-fileupload');

let files = [];

function reIndex() {
    files = [];
    let count = 0;
    fs.readdirSync(__dirname+"/static").forEach( (file)=> {
        files.push(file);
        count++;
    });
    console.log("File reindexing finished. Processed files: ",count);
}

reIndex();

if (!process.env.password) {
    console.error("No authentication set. Killing process . . . ")
    process.exit(1);
}

// AUTH

app.use(basicAuth({ 
    challenge: true,
    users: {
       [process.env.user]: process.env.password
    }
}));

// API

app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let file = req.files.file;

  file.mv(__dirname+'/static/'+file.name, function(err) {
    if (err)
      return res.status(500).send(err);

      res.sendFile(__dirname+"/upload.html");
      reIndex();
  });
});

app.get("/upload", (req, res)=>{
    res.sendFile(__dirname+"/upload.html");
});

app.get("/reIndex", (req,res,next)=> {
    reIndex();
    res.sendStatus(200);
});

app.get("/getPicture", (req,res,next)=> {
    var options = {
        root: __dirname + '/static/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };

    const randomFileName = files[Math.floor(Math.random()*files.length)];
    
    res.sendFile(__dirname+"/static/"+randomFileName);
    console.log("Sent file: ",randomFileName)
});

app.listen("6969");
console.log("api started");