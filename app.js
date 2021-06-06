//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


// create database connection for users
mongoose.connect('mongodb://localhost:27017/secretsDB', {useNewUrlParser: true, useUnifiedTopology: true});

// create schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// plugin has to be before the declaration of User object
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);
app.get("/", function(req,res){
    res.render("home");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req, res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    newUser = new User({
        email: userEmail,
        password: userPassword
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else {
            console.log(err);
        }
    });
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, result){
        if(!err){
            if(result){
                if((result.password === password)) {
                    res.render("secrets");
                }
            }
        }
        else {
            console.log(err);
        }
    });
});

app.listen(3000, function(){
    console.log("server started on port 3000");
});