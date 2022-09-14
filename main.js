const express = require("express");
const ejs = require("ejs");
const {readFileSync, writeFileSync} = require("fs");

const root = "root";

const website = express();
website.set("views", root);
website.set("view engine", "ejs");

/*/ Unneeded, nginx handles extensions
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
//*/

website.get(/^\/.*\.ejs$/, (req, res) => { // "/***.ejs"
    let p = root+req.path;
    console.log(p);
    ejs.renderFile(p, {}, {}, (err, str) => {
        if (err) {
            console.log(err);
            res.sendStatus(400);
            return;
        }
        res.send(str);
    });
});

website.get("*", (req, res) => {
    res.sendStatus(418); // fix nginx's regex if you'll ever encounter this teapot
});

//website.use(express.static(__dirname+"/"+root)); // sends raw .ejs as downloadable file

website.listen(10931, () => {
    console.log("Ready");
});