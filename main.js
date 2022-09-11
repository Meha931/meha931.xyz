const express = require("express");
const ejs = require("ejs");
const {readFileSync, writeFileSync, closeSync, existsSync} = require("fs");

const root = __dirname+"/"+"root";

const website = express();
website.set("views", root);
website.set("view engine", "ejs");

function doesFileExist(path) {
    try {
        readFileSync(path);
        return true;
    } catch (e) {
        //console.log(e);
        return false;
    }
}

function getExt(path) {
    let l = path.lastIndexOf(".");
    return (l===-1) ? "" : path.slice(l+1);
}

function sendGuess(res,path) {
    if (doesFileExist(path)) {
        if (getExt(path) === "ejs") {
            res.render(path);
        } else if (getExt(path) === "html") {
            res.sendFile(path);
        } else {
            res.sendfile(path); // yes these are conceptually different
        }
    } else if (doesFileExist(path+".ejs")) {
        res.render(path+".ejs");
    } else if (doesFileExist(path+".html")) {
        res.sendFile(path+".html");
    } else {
        return false;
    }
    return true;
}

website.get("/*", (req, res) => {
    let p = root+req.path;
    //console.log(p,doesFileExist(p));
    if (req.path.slice(-1) === "/") p += "index";
    if (!sendGuess(res,p)) {
        //res.sendStatus(404);
        if (doesFileExist(root+"/404.ejs")) { // not else if
            res.render(root+"/404.ejs");
        } else if (doesFileExist(root+"/404.html")) {
            res.sendFile(root+"/404.html");
        } else {
            res.sendStatus(404);
        }
    }
});
/*/ fancy devcomments
website.use((req, res) => {
    res.status(404).send("aaaaaa");
});
//*/

website.listen(13377, () => {
    console.log("Ready");
});