const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
require('dotenv').config()

console.log(process.env.API_KEY);

let files = [];

function reindex() {
    files = [];
    fs.readdirSync(__dirname+"/static").forEach(file=> {
        files.push(file);
    });
    console.log("File reindexing finished");
}

reindex();

// API

app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    //console.log(req);
    next();
  });

app.use("/reindex", (req,res,next)=> {
    reindex();
    res.sendStatus(200);
});

app.use("/getPicture", (req,res,next)=> {
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
});

//app.use(express.static('static'))

app.listen("6969");