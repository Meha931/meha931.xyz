const express = require("express");
const ejs = require("ejs");
const {readFileSync, writeFileSync} = require("fs");

const root = "root";

const website = express();
website.set("views", root);
website.set("view engine", "ejs");

website.get("/*", (req, res) => {
    let p = root+req.path;
    ejs.renderFile(p, {}, {}, (err, str) => {
        if (err) {
            //console.log(err);
            res.sendStatus(400);
            return;
        }
        res.send(str);
    });
});

website.listen(13377, () => {
    console.log("Ready");
});