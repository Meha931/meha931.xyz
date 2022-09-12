const express = require("express");
const ejs = require("ejs");
const {readFileSync, writeFileSync} = require("fs");

const root = "root";

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

website.get("/*", (req, res) => {
    let p = root+req.path;
    if (getExt(req.path) === "ejs") {
        ejs.renderFile(p, {}, {}, (err, str) => {
            if (err) {
                //console.log(err);
                res.sendStatus(400);
                return;
            }
            res.send(str);
        });
    } else {
        if (doesFileExist(p)) res.sendFile(__dirname+"/"+p);
        else res.sendStatus(404);
    }
});

//website.use(express.static(__dirname+"/"+root));

website.listen(13377, () => {
    console.log("Ready");
});