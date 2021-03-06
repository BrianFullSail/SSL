// Enable strict routing
// Disabled by default, "/foo" and "/foo/" are treated the same by the router.
"use strict"

// loading the libraries to use

const fs = require("fs")
const http = require("http")
const path = require("path")
const url = require("url")

const express = require("express")
const request = require("request")
const bodyParser = require("body-parser")

// npm install -g express
// npm install -g ejs
// npm install -g request
// npm install -g body-parser
// npm install express-session

let ejs = require("ejs")

const session = require("express-session")
const router = express.Router()
const app = express()
app.use(session({secret:"secret", saveUninitialized: true, resave: true}))
app.set("view engine", "ejs")
app.engine("ejs", require("ejs").__express)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended:true} ))
var sess;


// where to get files to use like css styles
app.use(express.static("public"))
app.use("/", router);
var server = app.listen("8080")

router.get("/", function(req, res){
    sess = req.session
    res.render("index", {pagename: "Home", sess: sess}) // views/index.ejs
})

router.get("/about", function(req, res){
    sess = req.session
    res.render("about", {pagename: "About", sess: sess}) // views/about.ejs

})

router.get("/contact", function(req, res){
    sess = req.session
    res.render("contact", {pagename: "Contact", sess: sess}) // views/contact.ejs

})

router.get("/profile", function(req, res){
    sess = req.session
    if(typeof(sess) == undefined | sess.loggedin != true){
        var errors = ["Not a authenticated user"]
        res.render("index", {pagename: "Home", errors: errors})
    }
    else{
        res.render("profile", {pagename: "Profile", sess: sess})
    }
})

router.get("/logout", function(req, res){
    sess = req.session
    sess.loggedin = false;

    sess.destroy(function(err){
        res.redirect("/")
    })
})

router.post("/login", function(req, res){

    let errors = []
    sess = req.session

    if(req.body.email == ""){
        errors.push("Email is required")
    }
    if(req.body.password == ""){
        errors.push("Password is required")
    }
    if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email) | req.body.email.toLowerCase() != "mike@aol.com"){
        errors.push("Email is not valid")
    }
    if(/^[a-zA-Z]\w(3,14)$/.test(req.body.password) | req.body.password != "abc123"){
        errors.push("Password is not valid")
    }

    // write conditional here if matching user name and password is good show profile, if bad show index with errors
    if(req.body.email.toLowerCase() == "mike@aol.com" && req.body.password == "abc123"){
        sess.loggedin = true;
        res.render("profile", {pagename: "Profile", sess: sess})
    }
    if(req.body.email.toLowerCase() != "mike@aol.com" | req.body.password != "abc123"){
        sess.loggedin = false;
        errors.push("Email and/or password is incorrect")
        res.render("index", {pagename: "Home", errors: errors})
    }
    // username - Mike@aol.com (not case sensitive)
    // password - abc123

})

router.post("/register", function(req, res){

    let errors = []
    if(req.body.fname == ""){
        errors.push("First name is required")
    }
    if(req.body.lname == ""){
        errors.push("Last name is required")
    }
    if(req.body.address == ""){
        errors.push("Address is required")
    }
    if(req.body.city == ""){
        errors.push("City is required")
    }
    if(req.body.state == ""){
        errors.push("State is required")
    }
    if(!/^\d{5}(-\d{4})?$/.test(req.body.zip)){
        errors.push("Invalid zip code")
    }
    if(req.body.age == "select"){
        errors.push("No age group was selected")
    }
    if(req.body.gender == undefined){
        errors.push("No gender was selected")
    }
    if(req.body.checkbox == undefined){
        errors.push("Consent box was not checked")
    }
    if(req.body.bio == ""){
        errors.push("No bio was provided")
    }

    // if failed render contact page and pass the errors array
    // else if passed render contact page with errors array being empty
    res.render("contact", {pagename: "Contact", errors: errors})

})
