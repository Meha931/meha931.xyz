const express = require("express");
const ejs = require("ejs");
const {readFileSync, writeFileSync, write} = require("fs");
const { stringify } = require("querystring");

const root = "root";
// todo: stop mixing camel case and underscoring
const ejs_root = __dirname+"/includables/";
const data_root = __dirname+"/data/";
const data_names = {
    views: "views.json"
};
const data = {
    views: {}
};

const website = express();
website.set("views", root);
website.set("view engine", "ejs");

/*// Unneeded, nginx handles extensions
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

function readViews() {
    try {
        data.views = JSON.parse(readFileSync(data_root+data_names.views));
    } catch (e) {
        console.log("Probably unable to read views");
        console.log(e);
    }
}
function addViews(path) {
    let current = +data.views[path];
    if (isNaN(current)) {
        data.views[path] = 1;
        return;
    }
    data.views[path] = current+1;
}
function writeViews() {
    try {
        writeFileSync(data_root+data_names.views, JSON.stringify(data.views));
    } catch (e) {
        console.log("Probably unable to create views");
        console.log(e);
    }
}

website.get(/^\/.*\.ejs$/, (req, res) => { // "/***.ejs"
    readViews();
    let p = root+req.path;
    //console.log(p);
    let render_data = {
        ejs_root: ejs_root,
        addViews: addViews, // again, todo stop mixing naming styles
        path: req.path,
        views: data.views,
    };
    ejs.renderFile(p, render_data, {}, (err, str) => {
        if (err) {
            console.log(err);
            res.sendStatus(400);
            return;
        }
        res.send(str);
    });
    writeViews();
});

website.get("*", (req, res) => {
    res.sendStatus(418); // fix nginx's regex if you'll ever encounter this teapot
});

//website.use(express.static(__dirname+"/"+root)); // sends raw .ejs as downloadable file

website.listen(10931, () => {
    console.log("Ready");
});