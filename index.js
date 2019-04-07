const express = require("express");
const fs = require("fs");
const app = express();
const basicAuth = require("express-basic-auth");
require('dotenv').config()

let files = [];

function reindex() {
    files = [];
    let count = 0;
    fs.readdirSync(__dirname+"/static").forEach( (file)=> {
        files.push(file);
        count++;
    });
    console.log("File reindexing finished. Processed files: ",count);
}

reindex();

if (!process.env.password) {
    console.error("No authentication set. Killing process . . . ")
    process.exit(1);
}

// AUTH

app.use(basicAuth({ 
    users: {
       user: process.env.password
    }
}));

// API

app.get("/reindex", (req,res,next)=> {
    reindex();
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